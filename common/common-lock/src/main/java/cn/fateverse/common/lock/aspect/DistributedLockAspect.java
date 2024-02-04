package cn.fateverse.common.lock.aspect;

import cn.fateverse.common.lock.annotation.DistributedLock;
import cn.fateverse.common.lock.enums.BlockLockType;
import cn.fateverse.common.lock.service.LockKeyGenerator;
import cn.hutool.core.util.StrUtil;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.redis.constant.RedisConstant;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;

/**
 * 分布式锁切面类
 * redis 中缓存key说明:
 *
 * @author Clay
 * @date 2023-05-10
 */
@Aspect
@Order(4)
@Slf4j
@ConditionalOnProperty(name = "enabled", prefix = "redis.distributed-lock", havingValue = "true", matchIfMissing = true)
public class DistributedLockAspect {

    //redis使用分隔符
    private static final String REDIS_SEPARATOR = RedisConstant.REDIS_SEPARATOR;
    //redis缓存全局前缀
    private static final String DISTRIBUTED_CHECK_KEY_PREFIX = "distributed_lock" + REDIS_SEPARATOR;

    private final RedissonClient redissonClient;

    private final LockKeyGenerator lockKeyGenerator;

    public DistributedLockAspect(RedissonClient redissonClient,
                                 LockKeyGenerator lockKeyGenerator) {
        this.redissonClient = redissonClient;
        this.lockKeyGenerator = lockKeyGenerator;
    }

    @Around("@within(distributedLock) || @annotation(distributedLock)")
    public Object distributedLockCheck(ProceedingJoinPoint point, DistributedLock distributedLock) throws Throwable {
        if (StrUtil.isEmpty(distributedLock.prefix())) {
            throw new CustomException("lock prefix can't be null...");
        }
        //获取到lock的关键词
        String lockKey = DISTRIBUTED_CHECK_KEY_PREFIX + lockKeyGenerator.getLockKey(point, distributedLock);
        //获取到锁
        RLock lock = chooseLock(distributedLock, lockKey);

        boolean lockSuccess = false;
        Object proceed = null;
        try {
            lockSuccess = lock.tryLock(distributedLock.waitTime(), distributedLock.expireTime(), distributedLock.timeUnit());
            if (lockSuccess) {
                proceed = point.proceed();
            } else {
                log.debug("tryLock success key [{}]", lockKey);
                throw new CustomException("系统繁忙,请稍后再试");
            }
        } catch (InterruptedException e) {
            log.error("key is : {" + lockKey + "} tryLock error ", e);
            throw new CustomException("系统繁忙,请稍后再试");
        } finally {
            if (lockSuccess) {
                lock.unlock();
            }
        }
        return proceed;
    }


    private RLock chooseLock(DistributedLock distributedLock, String lockKey) {
        BlockLockType category = distributedLock.lock();
        switch (category) {
            case FAIR:
                return redissonClient.getFairLock(lockKey);
            case SPIN:
                return redissonClient.getSpinLock(lockKey);
            case COMMON:
                return redissonClient.getLock(lockKey);
            default:
                throw new CustomException("锁类型错误");
        }
    }
}
