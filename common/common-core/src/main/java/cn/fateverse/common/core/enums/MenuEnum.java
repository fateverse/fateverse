package cn.fateverse.common.core.enums;

/**
 * @author Clay
 * @date 2022/11/9
 */
public enum MenuEnum {

    /**
     * 状态信息
     */
    DIRECTORY("D", "目录"),
    MENU("M", "菜单"),
    BUTTON("B", "按钮"),
    LAYOUT("LAYOUT", "Layout"),
    PARENT_VIEW("PARENT_VIEW", "ParentView"),
    ;




    private final String code;
    private final String info;

    MenuEnum(String code, String info) {
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
