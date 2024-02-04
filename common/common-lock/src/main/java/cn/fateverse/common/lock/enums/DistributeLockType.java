package cn.fateverse.common.lock.enums;

/**
 * @author Clay
 * @date 2023-05-10
 */
public enum DistributeLockType {

    /**
     * 重入锁
     */
    REENTRANT_LOCK,

    /**
     * 非公平锁
     */
    FAIR_LOCK,

    /**
     * 联和锁
     */
    MULTI_LOCK,

    /**
     * 红锁
     */
    RED_LOCK,

    /**
     * 读写锁
     */
    READ_WRITE_LOCK,
    ;

}
