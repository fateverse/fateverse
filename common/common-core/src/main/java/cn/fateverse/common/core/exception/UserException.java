package cn.fateverse.common.core.exception;

/**
 * 用户信息异常类
 *
 * @author Clay
 * @date 2022/10/30
 */
public class UserException extends BaseException {


    public UserException(String code, Object[] args) {
        super("user", code, args, null);
    }
}
