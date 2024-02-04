package cn.fateverse.common.core.annotaion;

import java.lang.annotation.*;

/**
 * 用于标注当前对象中存在@Excel注解标注的需要导出的字段
 *
 * @author Clay
 * @date 2022/12/19
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
public @interface Excels {

    /**
     * 字段描述
     */
    String value() default "";


    /**
     * 字段排序
     */
    int order() default Integer.MAX_VALUE;
}
