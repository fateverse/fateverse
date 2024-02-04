package cn.fateverse.notice.enums;

/**
 * @author Clay
 * @date 2023-04-14
 */
public enum ActionEnums {

    /**
     * notice 的操作
     */
    SEND("send"),
    REMOVE("remove"),
    ;


    private final String type;

    ActionEnums(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
