package cn.fateverse.common.excel.utils;

import cn.fateverse.common.core.annotaion.Excel;
import cn.fateverse.common.core.annotaion.Excels;
import lombok.Data;

import java.lang.reflect.Field;

/**
 * @author Clay
 * @date 2022/12/19
 */
@Data
public class ExcelAssist {

    private Field field;

    private Excel excel;

    private Excels excels;

    private int order;

    private String objectFieldName;

    public ExcelAssist(Field field, Excels excels) {
        this.field = field;
        this.objectFieldName = field.getName();
        this.excels = excels;
        order = excels.order();
    }

    public ExcelAssist(Field field, Excel excel, ExcelAssist assist) {
        this.field = field;
        this.excel = excel;
        if (null != assist) {
            this.objectFieldName = assist.objectFieldName;
            if (excel.order() != Integer.MAX_VALUE && assist.getExcels().order() != Integer.MAX_VALUE) {
                order = assist.getExcels().order() * 10 + excel.order();
            } else {
                order = excel.order();
            }
        } else {
            order = excel.order();
        }
    }
}
