package cn.fateverse.common.redis.exception;

/**
 * @author Clay
 * @date 2023-10-15
 */
public class RedisCacheException extends RuntimeException {

    public RedisCacheException(String message, Throwable cause) {
        super(message, cause);
    }

    public RedisCacheException(Throwable cause) {
        super(cause);
    }

    public RedisCacheException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

    public RedisCacheException(String message) {
        super(message);
    }
}
