package cn.fateverse.common.core.exception;


/**
 * 用户密码不正确或不符合规范异常类
 *
 * @author Clay
 * @date 2022/10/30
 */
public class UserPasswordNotMatchException extends UserException {


    public UserPasswordNotMatchException() {
        super("user.password.not.match", null);
    }
}
