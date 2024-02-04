package cn.fateverse.monitor.conf;

import de.codecentric.boot.admin.server.config.AdminServerProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;

/**
 * 配置安全认证,以便其他服务注册
 *
 * @author Clay
 * @date 2022/11/10
 */
@Configuration
public class SecuritySecureConfig {

    /**
     * 应用上下文路径
     */
    private final String adminContextPath;

    public SecuritySecureConfig(AdminServerProperties adminServerProperties) {
        this.adminContextPath = adminServerProperties.getContextPath();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        SavedRequestAwareAuthenticationSuccessHandler successHandler = new SavedRequestAwareAuthenticationSuccessHandler();
        successHandler.setTargetUrlParameter("redirectTo");
        successHandler.setDefaultTargetUrl(adminContextPath + "/");
        http.authorizeRequests()
                //1.配置所有静态资源和登录也可以公开访问
                .antMatchers(adminContextPath + "/assets/**")
                .permitAll()
                .antMatchers(adminContextPath + "/login")
                .permitAll()
                //2. 其他请求,必须经过认证
                .antMatchers("/actuator/**","/instances").permitAll()
                .anyRequest().authenticated()
                .and()
                //3. 配置登录和登出路径
                .formLogin().loginPage(adminContextPath + "/login")
                .successHandler(successHandler)
                .and()
                .logout().logoutUrl(adminContextPath + "/logout");
        http.headers().frameOptions().disable();
        return http.build();
    }

}
