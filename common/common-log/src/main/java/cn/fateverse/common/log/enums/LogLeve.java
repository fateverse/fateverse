package cn.fateverse.common.log.enums;

/**
 * @author Clay
 * @date 2023-05-25
 */
public enum LogLeve {

    ALL("all"),
    SUCCESS("success"),
    ERROR("error"),
    ;

    final String value;

    LogLeve(String value) {
        this.value = value;
    }
}
