package cn.fateverse.common.lock.base;

import cn.fateverse.common.lock.enums.DistributeLockType;

import java.util.concurrent.TimeUnit;

/**
 * @author Clay
 * @date 2023-05-10
 */
public class DistributeLockParam {

    /**
     * 锁id
     */
    private String lockUuid;

    /**
     * 锁前缀
     */
    private String lockNamePrefix;

    /**
     * 过期时间
     */
    private Long expireTime;

    /**
     * 等待时间
     */
    private Long waitTime;

    /**
     * 时间单位
     */
    private TimeUnit timeUnit;

    /**
     * 间隔符
     */
    private String delimiter;

    /**
     * 锁类型
     */
    private DistributeLockType lockType;


    public String getLockUuid() {
        return lockUuid;
    }

    public void setLockUuid(String lockUuid) {
        this.lockUuid = lockUuid;
    }

    public String getLockNamePrefix() {
        return lockNamePrefix;
    }

    public void setLockNamePrefix(String lockNamePrefix) {
        this.lockNamePrefix = lockNamePrefix;
    }

    public Long getExpireTime() {
        return expireTime;
    }

    public void setExpireTime(Long expireTime) {
        this.expireTime = expireTime;
    }

    public Long getWaitTime() {
        return waitTime;
    }

    public void setWaitTime(Long waitTime) {
        this.waitTime = waitTime;
    }

    public TimeUnit getTimeUnit() {
        return timeUnit;
    }

    public void setTimeUnit(TimeUnit timeUnit) {
        this.timeUnit = timeUnit;
    }

    public String getDelimiter() {
        return delimiter;
    }

    public void setDelimiter(String delimiter) {
        this.delimiter = delimiter;
    }

    public DistributeLockType getLockType() {
        return lockType;
    }

    public void setLockType(DistributeLockType lockType) {
        this.lockType = lockType;
    }
}
