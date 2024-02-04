package cn.fateverse.gateway.exception;

import cn.fateverse.common.core.exception.CustomException;

/**
 * @author Clay
 * @date 2023-10-15
 */
public class BlackListException extends CustomException {

    public BlackListException(String message) {
        super(message);
    }

    public BlackListException(String message, Integer code) {
        super(message, code);
    }

    public BlackListException(String message, Throwable e) {
        super(message, e);
    }

    public BlackListException() {
    }
}
