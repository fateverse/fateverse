package cn.fateverse.common.core.enums;

/**
 * @author Clay
 * @date 2022/11/6
 */
public enum StateEnum {

    /**
     * 状态信息
     */
    NORMAL("1", "正常"),
    DISABLE("0", "停用");



    private final String code;
    private final String info;

    StateEnum(String code, String info) {
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
