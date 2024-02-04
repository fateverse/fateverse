package cn.fateverse.common.core.enums;

/**
 * 用户状态
 *
 * @author Clay
 * @date 2022/10/30
 */
public enum UserState {
    /**
     * 用户状态信息
     */
    DISABLE("0", "停用"),
    OK("1", "正常"),
    DELETED("2", "删除");

    private final String code;
    private final String info;

    UserState(String code, String info) {
        this.code = code;
        this.info = info;
    }

    public String getCode() {
        return code;
    }

    public String getInfo() {
        return info;
    }
}

