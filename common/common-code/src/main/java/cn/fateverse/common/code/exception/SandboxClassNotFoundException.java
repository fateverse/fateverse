package cn.fateverse.common.code.exception;

import cn.fateverse.common.core.exception.CustomException;

/**
 * @author Clay
 * @date 2023-10-25
 */
public class SandboxClassNotFoundException extends CustomException {

    public SandboxClassNotFoundException(String message) {
        super(message);
    }
}
