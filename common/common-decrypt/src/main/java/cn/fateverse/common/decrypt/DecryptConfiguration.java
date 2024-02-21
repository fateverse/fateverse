package cn.fateverse.common.decrypt;

import cn.fateverse.common.decrypt.aspect.EncryptAspect;
import cn.fateverse.common.decrypt.config.EncryptProperties;
import cn.fateverse.common.decrypt.service.DefaultEncryptService;
import cn.fateverse.common.decrypt.service.EncryptService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

/**
 * @author Clay
 * @date 2023-07-04
 */
@EnableConfigurationProperties({EncryptProperties.class})
public class DecryptConfiguration {



    @Bean
    @ConditionalOnMissingBean({EncryptService.class})
    public EncryptService encryptService(EncryptProperties encryptProperties) {
        return new DefaultEncryptService(encryptProperties);
    }


    @Bean
    @ConditionalOnBean(EncryptService.class)
    public EncryptAspect encryptAspect(EncryptService encryptService) {
        return new EncryptAspect(encryptService);
    }
}
