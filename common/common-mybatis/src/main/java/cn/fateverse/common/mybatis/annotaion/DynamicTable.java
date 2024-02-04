package cn.fateverse.common.mybatis.annotaion;

import org.springframework.core.annotation.AliasFor;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 动态表注解
 * 可以放在方法上,也可以放在类上,先判断方法上是否存在,如果不存在则判断类
 */
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface DynamicTable {

    /**
     * 表名
     *
     * @return 表名
     */
    @AliasFor("value")
    String tableName() default "";

    /**
     * 表名
     *
     * @return 表名
     */
    @AliasFor("tableName")
    String value() default "";


}
