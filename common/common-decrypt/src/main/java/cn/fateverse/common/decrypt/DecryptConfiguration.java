package cn.fateverse.common.decrypt;

import cn.fateverse.common.decrypt.aspect.EncryptAspect;
import cn.fateverse.common.decrypt.config.EncryptProperties;
import cn.fateverse.common.decrypt.service.EncryptService;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

/**
 * @author Clay
 * @date 2023-07-04
 */
@EnableConfigurationProperties({EncryptProperties.class})
public class DecryptConfiguration {

    @Bean
    public EncryptAspect encryptAspect() {
        return new EncryptAspect();
    }

    @Bean
    public EncryptService encryptService() {
        return new EncryptService();
    }
}
