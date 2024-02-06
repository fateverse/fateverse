package cn.fateverse.common.security.annotation;

import java.lang.annotation.*;

/**
 * RequestMapping接口的开关
 *
 * @author Clay
 * @date 2024/1/15  16:26
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface MappingSwitch {

    /**
     * 描述信息
     */
    String value() default "";

}
