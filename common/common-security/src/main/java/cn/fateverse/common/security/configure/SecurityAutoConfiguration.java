package cn.fateverse.common.security.configure;

import cn.fateverse.common.security.aspect.SecurityInnerAspect;
import cn.fateverse.common.security.configure.properties.DemoSwitchProperties;
import cn.fateverse.common.security.configure.properties.PermitAllUrlProperties;
import cn.fateverse.common.security.filter.AuthenticationTokenFilter;
import cn.fateverse.common.security.handle.*;
import cn.fateverse.common.security.service.MappingSwitchService;
import cn.fateverse.common.security.service.PermissionService;
import cn.fateverse.common.security.service.TokenService;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;


/**
 * @author Clay
 * @date 2023-05-21
 */
@ConfigurationPropertiesScan(basePackageClasses = {DemoSwitchProperties.class})
@EnableConfigurationProperties(PermitAllUrlProperties.class)
public class SecurityAutoConfiguration {

    /**
     * 鉴权具体的实现逻辑
     *
     * @return (# ss.xxx)
     */
    @Bean("ss")
    public PermissionService permissionService() {
        return new PermissionService();
    }


    /**
     * token验证处理
     *
     * @return tokenService
     */
    @Bean
    public TokenService tokenService() {
        return new TokenService();
    }


    /**
     * 认证失败处理类
     *
     * @return authenticationEntryPointImpl
     */
    @Bean
    public AuthenticationEntryPointImpl authenticationEntryPointImpl() {
        return new AuthenticationEntryPointImpl();
    }


    /**
     * token 验证拦截器
     *
     * @return authenticationTokenFilter
     */
    @Bean
    public AuthenticationTokenFilter authenticationTokenFilter() {
        return new AuthenticationTokenFilter();
    }

    /**
     * inner注解拦截器
     *
     * @return securityInnerAspect
     */
    //@Bean
    public SecurityInnerAspect securityInnerAspect() {
        return new SecurityInnerAspect();
    }

    @Bean
    public GlobalExceptionHandler globalExceptionHandler() {
        return new GlobalExceptionHandler();
    }

    @Bean
    public ResultResponseAdvice resultResponseAdvice() {
        return new ResultResponseAdvice();
    }

    @Bean
    public LogoutSuccessHandlerImpl getLogoutSuccessHandler(TokenService tokenService) {
        return new LogoutSuccessHandlerImpl(tokenService);
    }

    @Bean
    public MappingSwitchService mappingSwitchService(){
        return new MappingSwitchService();
    }


    @Bean
    public MappingSwitchInterceptor mappingSwitchInterceptor() {
        return new MappingSwitchInterceptor();
    }
}
