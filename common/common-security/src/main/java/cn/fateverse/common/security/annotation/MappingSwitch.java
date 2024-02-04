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
     * value: 作为存储使用的key,不填写则默认使用uri
     */
    String value() default "";

}
