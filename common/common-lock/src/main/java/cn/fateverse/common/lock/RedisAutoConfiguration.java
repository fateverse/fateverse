package cn.fateverse.common.lock;

import cn.fateverse.common.lock.aspect.ResubmitLockAspect;
import cn.fateverse.common.lock.service.DistributedLockService;
import cn.fateverse.common.lock.service.LockKeyGenerator;
import cn.fateverse.common.lock.service.impl.AbstractDistributeLockSupport;
import cn.fateverse.common.lock.service.impl.DistributedLockKeyGenerator;
import cn.fateverse.common.lock.service.impl.DistributedLockServiceImpl;
import cn.fateverse.common.lock.aspect.DistributedLockAspect;
import cn.fateverse.common.redis.aspect.RedisCacheAspect;
import cn.fateverse.common.lock.service.impl.RedisDistributeLockSupport;
import cn.fateverse.common.redis.configure.RedisConfig;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.Bean;

/**
 * @author Clay
 * @date 2023-05-21
 */
@ConditionalOnClass(RedisConfig.class)
public class RedisAutoConfiguration {

    @Bean
    public DistributedLockAspect distributedLockAspect(RedissonClient redissonClient, LockKeyGenerator lockKeyGenerator){
        return new DistributedLockAspect(redissonClient, lockKeyGenerator);
    }

    @Bean
    public ResubmitLockAspect resubmitLockAspect(DistributedLockService distributedLockService){
        return new ResubmitLockAspect(distributedLockService);
    }

    @Bean
    public RedisCacheAspect redisCacheAspect(){
        return new RedisCacheAspect();
    }

    @Bean
    public LockKeyGenerator lockKeyGenerator(){
        return new DistributedLockKeyGenerator();
    }

    @Bean
    public DistributedLockService distributedLockService(RedissonClient redissonClient){
        return new DistributedLockServiceImpl(redissonClient);
    }

    @Bean
    public AbstractDistributeLockSupport<RLock> distributeLockSupport(RedissonClient redissonClient){
        return new RedisDistributeLockSupport(redissonClient);
    }
}
