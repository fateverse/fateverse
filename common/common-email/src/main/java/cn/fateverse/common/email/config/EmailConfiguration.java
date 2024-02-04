package cn.fateverse.common.email.config;

import cn.fateverse.common.email.service.EmailService;
import cn.fateverse.common.email.service.impl.EmailServiceImpl;
import cn.fateverse.common.email.service.session.EmailSessionProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

/**
 * 邮件配置类
 *
 * @author Clay
 * @date 2023-03-22
 */
@EnableConfigurationProperties({EmailProperties.class})
public class EmailConfiguration {

    @Bean
    EmailService emailService() {
        return new EmailServiceImpl();
    }

    @Bean
    @ConditionalOnMissingBean(EmailSessionProvider.class)
    EmailSessionProvider emailSessionProvider() {
        return new EmailSessionProvider();
    }


}
