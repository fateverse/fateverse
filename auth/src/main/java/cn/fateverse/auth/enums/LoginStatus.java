package cn.fateverse.auth.enums;

/**
 * @author Clay
 * @date 2022/11/2
 */
public enum LoginStatus {
    /**
     * 登录状态
     */
    SUCCESS(0, "登录成功!"),
    FAIL(1, "登录失败");

    private final Integer code;
    private final String info;

    LoginStatus(Integer code, String info) {
        this.code = code;
        this.info = info;
    }

    public Integer getCode() {
        return code;
    }

    public String getInfo() {
        return info;
    }

}
