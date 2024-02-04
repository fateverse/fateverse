package cn.fateverse.common.security.configure;

import cn.fateverse.common.security.configure.properties.PermitAllUrlProperties;
import cn.fateverse.common.security.filter.AuthenticationTokenFilter;
import cn.fateverse.common.security.handle.AuthenticationEntryPointImpl;
import cn.fateverse.common.security.handle.LogoutSuccessHandlerImpl;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.CorsFilter;

import javax.annotation.Resource;

/**
 * 安全认证配置
 *
 * @author Clay
 * @date 2022/10/27
 */
@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableConfigurationProperties(PermitAllUrlProperties.class)
public class SecurityCloudConfiguration {

    @Resource
    private PermitAllUrlProperties permitAllUrl;

    @Resource
    private AuthenticationEntryPointImpl authenticationHandler;

    /**
     * 跨域过滤器
     */
    @Resource
    private CorsFilter corsFilter;


    @Resource
    private LogoutSuccessHandlerImpl logoutSuccessHandler;
    /**
     * token认证过滤器
     */
    @Resource
    private AuthenticationTokenFilter authenticationTokenFilter;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                // CSRF禁用，因为不使用session
                .csrf().disable()
                // 认证失败处理类
                .exceptionHandling().authenticationEntryPoint(authenticationHandler)
                .accessDeniedHandler(authenticationHandler).and()
                // 基于token，所以不需要session
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                // 过滤请求
                .authorizeRequests()
                .antMatchers(permitAllUrl.getUrls()).permitAll()
                .antMatchers(
                        HttpMethod.GET,
                        "/*.html",
                        "/**/*.html",
                        "/**/*.css",
                        "/**/*.js"
                ).permitAll()
                //除上面外的所有请求全部需要鉴权认证
                .anyRequest().authenticated()
                .and()
                .headers().frameOptions().disable();
        httpSecurity.logout().logoutUrl("/logout").logoutSuccessHandler(logoutSuccessHandler);
        // 添加JWT filter
        httpSecurity.addFilterBefore(authenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);
        // 添加CORS filter
        httpSecurity.addFilterBefore(corsFilter, LogoutFilter.class);
        httpSecurity.addFilterBefore(corsFilter, AuthenticationTokenFilter.class);
        return httpSecurity.build();
    }



    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Component
    @ConditionalOnMissingBean({UserDetailsService.class})
    public static class BaseUserDetailsService implements UserDetailsService {

        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
            return null;
        }
    }

}
