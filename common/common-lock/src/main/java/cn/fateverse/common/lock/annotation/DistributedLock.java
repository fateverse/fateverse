package cn.fateverse.common.lock.annotation;

import cn.fateverse.common.lock.enums.BlockLockType;
import cn.fateverse.common.redis.constant.RedisConstant;

import java.lang.annotation.*;
import java.util.concurrent.TimeUnit;

/**
 * @author Clay
 * @date 2023-05-10
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
public @interface DistributedLock {

    /**
     * 前缀
     */
    String prefix() default "";

    /**
     * 锁过期时间
     */
    int expireTime() default 30;

    /**
     * 获取锁等待时间
     */
    int waitTime() default 10;

    /**
     * 时间单位
     */
    TimeUnit timeUnit() default TimeUnit.SECONDS;

    /**
     * 分隔符
     */
    String delimiter() default RedisConstant.REDIS_SEPARATOR;

    /**
     * 锁类型
     */
    BlockLockType lock() default BlockLockType.COMMON;

}
