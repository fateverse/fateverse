package cn.fateverse.common.lock.annotation;

import java.lang.annotation.*;

/**
 * 参数注解
 *
 * @author Clay
 * @date 2023-05-10
 */
@Target({ElementType.PARAMETER, ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
public @interface DistributedLockParam {

    String name() default "";
}
