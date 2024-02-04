package cn.fateverse.common.lock.service;

import cn.fateverse.common.lock.base.DistributeLockParam;
import cn.fateverse.common.redis.constant.RedisConstant;
import com.google.common.base.Joiner;

/**
 * 分布式锁的接口
 *
 * @author Clay
 * @date 2023-05-10
 */
public interface DistributeLockSupport<T> {
    /**
     * 默认的分隔符
     */
    String DEFAULT_DELIMITER = RedisConstant.REDIS_SEPARATOR;


    String DEFAULT_KEY_PREFIX = "LOCK";


    Long DEFAULT_EXPIRE_TIME = 10L;


    Long DEFAULT_WAIT_TIME = 10L;


    Joiner DEFAULT_JOINER = Joiner.on(DistributeLockSupport.DEFAULT_DELIMITER).
            skipNulls();

    /**
     * 加锁
     *
     * @param distributeLockParam 锁参数
     * @return 返回锁
     */
    T lock(DistributeLockParam distributeLockParam);

    /**
     * 解锁
     *
     * @param lock 锁
     */
    void unlock(T lock);
}
