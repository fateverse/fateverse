package cn.fateverse.notice.entity;

import cn.fateverse.notice.enums.ActionEnums;
import lombok.Data;

import java.io.Serializable;

/**
 * @author Clay
 * @date 2023-05-04
 */
@Data
public class Message implements Serializable {
    private String id;

    private Object message;

    private ActionEnums type;

    private String group;

}
