package cn.fateverse.common.core.exception;

/**
 * 自定义异常
 *
 * @author Clay
 * @date 2022/10/29
 */
public class CustomException extends RuntimeException {


    private Integer code;

    private String message;

    public CustomException(String message) {
        this.message = message;
    }

    public CustomException(String message, Integer code) {
        this.message = message;
        this.code = code;
    }

    public CustomException(String message, Throwable e) {
        super(message, e);
        this.message = message;
    }

    public CustomException() {

    }


    @Override
    public String getMessage() {
        return message;
    }

    public Integer getCode() {
        return code;
    }
}

