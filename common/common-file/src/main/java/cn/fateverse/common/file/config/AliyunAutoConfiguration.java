package cn.fateverse.common.file.config;

import cn.fateverse.common.file.service.AliyunFileService;
import cn.fateverse.common.file.service.client.AliyunClient;
import cn.fateverse.common.file.service.client.AliyunClientProvider;
import cn.fateverse.common.file.service.impl.AliyunFileStoreService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

/**
 * 阿里云oss 自动装配
 *
 * @author Clay
 * @date 2023-02-17
 */
@EnableConfigurationProperties({AliyunProperties.class})
public class AliyunAutoConfiguration {

    @Bean
    public AliyunFileService aliyunFileService() {
        return new AliyunFileService();
    }

    @Bean
    @ConditionalOnMissingBean(AliyunClientProvider.class)
    public AliyunClientProvider aliyunClient() {
        return new AliyunClient();
    }

    @Bean("aliyunFileStoreService")
    public AliyunFileStoreService aliyunFileStoreService(AliyunFileService aliyunFileService) {
        return new AliyunFileStoreService(aliyunFileService);
    }

}
