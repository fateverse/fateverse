package cn.fateverse.common.mybatis.handler;

import cn.fateverse.common.core.exception.CustomException;

public class DynamicException extends CustomException {
    public DynamicException(String message) {
        super(message);
    }

    public DynamicException(String message, Throwable cause) {
        super(message, cause);
    }

}
