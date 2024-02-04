package cn.fateverse.common.lock.enums;

/**
 * 锁类型
 *
 * @author Clay
 * @date 2023-05-10
 */
public enum BlockLockType {

    /**
     * 统一锁
     */
    COMMON,
    /**
     * 平凡锁
     */
    SPIN,
    /**
     * 可重入失败锁
     */
    FAIR;

}
