package cn.fateverse.common.file.config;

import cn.fateverse.common.file.service.MinioFileService;
import cn.fateverse.common.file.service.client.MinIoClient;
import cn.fateverse.common.file.service.client.MinioClientProvider;
import cn.fateverse.common.file.service.impl.MinioFileStoreService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

/**
 * minio 自动装配
 *
 * @author Clay
 * @date 2023-02-17
 */
@EnableConfigurationProperties({MinioProperties.class})
public class MinioAutoConfiguration {

    @Bean
    public MinioFileService minioFileService() {
        return new MinioFileService();
    }


    @Bean
    @ConditionalOnMissingBean(MinioClientProvider.class)
    public MinioClientProvider minioClient() {
        return new MinIoClient();
    }


    @Bean("minioFileStoreService")
    public MinioFileStoreService minioFileStoreService(MinioFileService minioFileService) {
        return new MinioFileStoreService(minioFileService);
    }
}
