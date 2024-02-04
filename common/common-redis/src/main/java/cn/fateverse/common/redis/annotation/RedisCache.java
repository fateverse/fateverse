package cn.fateverse.common.redis.annotation;


import cn.fateverse.common.redis.enums.RedisCacheType;

import java.lang.annotation.*;
import java.util.concurrent.TimeUnit;

/**
 * @author Clay
 * @date 2023-06-05
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RedisCache {

    /**
     * 前缀
     */
    String prefix() default "";

    /**
     * 主键的el表达式,用于修改和更新的时候删除指定的缓存
     * 参数Spring EL表达式例如 #{param.name},通过表达式获取到id数据
     */
    String primaryKey() default "";

    /**
     * 缓存过期时间,timeout为 0 则表示不设置过期时间
     */
    long timeout() default 0;

    /**
     * 缓存过期时间校验的时间间隔的单位
     */
    TimeUnit timeUnit() default TimeUnit.SECONDS;

    /**
     * 操作类型
     */
    RedisCacheType type() default RedisCacheType.GET;

    /**
     * keys和ignoreKeys不能同时使用
     * 参数Spring EL表达式例如 #{param.name},表达式的值作为防重复校验key的一部分
     */
    String[] keys() default {};

    /**
     * keys和ignoreKeys不能同时使用
     * ignoreKeys不区分入参，所有入参拥有相同的字段时，都将过滤掉
     */
    String[] ignoreKeys() default {};

    /**
     * Spring EL表达式,决定是否进行重复提交校验,多个条件之间为且的关系,默认是进行校验
     */
    String[] conditions() default {"true"};

    /**
     * 当未配置key时，设置哪几个参数作，默认取所有参数
     *
     * @return
     */
    int[] argsIndex() default {};


}
