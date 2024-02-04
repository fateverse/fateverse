package cn.fateverse.common.security.annotation;

import cn.fateverse.common.security.configure.SecurityAutoConfiguration;
import cn.fateverse.common.security.configure.TaskExecutePoolConfiguration;
import org.apache.dubbo.config.spring.context.annotation.EnableDubbo;
import org.springframework.context.annotation.Import;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 是否启动鉴权中心的权限校验功能
 *
 * @author Clay
 * @date 2022/10/28
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@EnableWebMvc
@EnableDubbo
@Import({SecurityAutoConfiguration.class, TaskExecutePoolConfiguration.class})
public @interface EnableSecurity {
}
