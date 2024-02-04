package cn.fateverse.common.core.annotaion;

import cn.fateverse.common.core.enums.AutoUserEnum;
import cn.fateverse.common.core.enums.MethodEnum;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * mybatis自动注入用户信息
 *
 * @author Clay
 * @date 2023-05-05
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface AutoUser {

    AutoUserEnum value() default AutoUserEnum.USER_NAME;

    /**
     * sql 方法 INSERT,UPDATE
     *
     * @return 方法类型
     */
    MethodEnum method();

}
