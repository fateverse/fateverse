package cn.fateverse.auth.config;

import cn.fateverse.auth.event.LoginInfoListener;
import cn.fateverse.auth.service.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.annotation.Resource;

/**
 * @author Clay
 * @date 2023-11-10  20:16
 */
@Configuration
public class AuthConfiguration {


    @Resource
    private UserDetailsServiceImpl userDetailsService;

    @Resource
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Bean
    public LoginInfoListener loginInfoListener(ThreadPoolTaskExecutor taskExecuteExecutor){
        return new LoginInfoListener(taskExecuteExecutor);
    }


    @Bean
    AuthenticationManager authenticationManager(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(userDetailsService)
                .passwordEncoder(bCryptPasswordEncoder)
                .and()
                .build();
    }

}
