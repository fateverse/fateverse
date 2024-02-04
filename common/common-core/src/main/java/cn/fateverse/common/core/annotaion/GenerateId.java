package cn.fateverse.common.core.annotaion;


import cn.fateverse.common.core.enums.GenIdEnum;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 自动生成id
 *
 * @author Clay
 * @date 2023-05-05
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface GenerateId {

    GenIdEnum idType() default GenIdEnum.UUID;

}
