package cn.fateverse.common.core.annotaion;

import java.lang.annotation.*;

/**
 * 用户实体类需要excel导出的字段
 *
 * @author Clay
 * @date 2022/12/19
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
public @interface Excel {
    /**
     * 字段描述
     */
    String value() default "";
    /**
     * 字段排序
     */
    int order() default Integer.MAX_VALUE;

    /**
     * 时间格式
     */
    String dateFormat() default "yyyy-MM-dd";

    /**
     * 字典类型
     */
    String dictType() default "";

    /**
     * 导出时在excel中每个列的高度 单位为字符
     * 占时未实现后其迭代
     */
    double height() default 14;

    /**
     * 导出时在excel中每个列的宽 单位为字符
     * 占时未实现后其迭代
     */
    double width() default 16;
}
