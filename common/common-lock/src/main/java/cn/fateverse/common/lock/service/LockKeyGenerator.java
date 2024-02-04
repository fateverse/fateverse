package cn.fateverse.common.lock.service;

import cn.fateverse.common.lock.annotation.DistributedLock;
import org.aspectj.lang.ProceedingJoinPoint;

/**
 * 锁的关键词生成接口
 *
 * @author Clay
 * @date 2023-05-10
 */
public interface LockKeyGenerator {

    /**
     * 获取自定义锁
     *
     * @param point aop切点
     * @param lock  锁注解
     * @return 锁关键词
     */
    String getLockKey(ProceedingJoinPoint point, DistributedLock lock);


}
