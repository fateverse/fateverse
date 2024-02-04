package cn.fateverse.code.entity;

import lombok.Data;

/**
 * @author Clay
 * @date 2023-05-29
 */
@Data
public class OptionInfo {

    private Boolean enabled;

    private String valueField;

    private String labelFiled;


    public static OptionInfo getDefaultInstance() {
        OptionInfo option = new OptionInfo();
        option.setEnabled(Boolean.FALSE);
        option.setValueField("");
        option.setLabelFiled("");
        return option;
    }
}
