package cn.fateverse.common.log.annotation;

import cn.fateverse.common.log.enums.BusinessType;
import cn.fateverse.common.log.enums.OperateType;

import java.lang.annotation.*;

/**
 * 自定义操作日志记录注解
 *
 * @author Clay
 * @date 2022/11/1
 */
@Target({ElementType.PARAMETER, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Log {
    /**
     * 日志记录名称
     */
    String title() default "";

    /**
     * 功能
     */
    BusinessType businessType() default BusinessType.OTHER;

    /**
     * 操作人类别
     */
    OperateType operatorType() default OperateType.MANAGE;

    /**
     * 是否保存请求的参数
     */
    boolean isSaveRequestData() default true;

}
