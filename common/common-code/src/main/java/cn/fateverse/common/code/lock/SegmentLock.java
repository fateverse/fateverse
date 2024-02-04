package cn.fateverse.common.code.lock;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.Supplier;

/**
 * @author Clay
 * @date 2023-10-25
 */
public class SegmentLock {

    private static final Map<String, ReentrantLock> lockMap = new ConcurrentHashMap<>();

    /**
     * 分段锁
     * @param key 锁名称
     * @param supplier 需要执行的函数
     * @return 执行后的结果
     * @param <T> 接收泛型
     */
    public static <T> T lock(String key, Supplier<T> supplier) {
        ReentrantLock lock = lockMap.get(key);
        if (lock == null) {
            lock = lockMap.get(key);
            if (lock == null) {
                synchronized (lockMap) {
                    lock = new ReentrantLock();
                    lockMap.put(key, lock);
                }
            }
        }
        lock.lock();
        try {
            return supplier.get();
        } finally {
            lock.unlock();
        }
    }


}
