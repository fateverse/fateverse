package cn.fateverse.common.lock.service.impl;

import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.lock.base.DistributeLockParam;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;

/**
 * 非阻塞分布式锁的具体实现
 *
 * @author Clay
 * @date 2023-05-10
 */
@Slf4j
public class RedisDistributeLockSupport extends AbstractDistributeLockSupport<RLock> {

    private final RedissonClient redissonClient;

    public RedisDistributeLockSupport(RedissonClient redissonClient) {
        this.redissonClient = redissonClient;
    }

    @Override
    public RLock lock(DistributeLockParam distributeLockParam) {
        distributeLockParam = fullDistributeDefaultValue(distributeLockParam);
        String lockKey = buildLockKey(distributeLockParam);
        RLock lock;
        try {
            switch (distributeLockParam.getLockType()) {
                // 可重入锁
                case REENTRANT_LOCK:
                    lock = redissonClient.getLock(lockKey);
                    break;
                // 非公平锁
                case FAIR_LOCK:
                    lock = redissonClient.getFairLock(lockKey);
                    break;
                default: {
                    throw new UnsupportedOperationException("暂时不支持此种方式的锁!");
                }
            }
            boolean locked = lock.tryLock(distributeLockParam.getWaitTime(), distributeLockParam.getExpireTime(), distributeLockParam.getTimeUnit());
            if (locked){
                return lock;
            }else {
                throw  new CustomException("获取锁失败");
            }
        } catch (InterruptedException e) {
            log.error("加锁为阻塞模式下的锁进行失败！", e);
            throw  new CustomException("获取锁失败");
        }
    }

    @Override
    public void unlock(RLock lock) {
        try {
            lock.unlock();
        } catch (Exception e) {
            log.error("解锁为阻塞模式下的锁进行失败！", e);
        }
    }
}
