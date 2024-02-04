package cn.fateverse.common.file.config;

import cn.fateverse.common.file.service.FTPFileService;
import cn.fateverse.common.file.service.client.FTPClientProvider;
import cn.fateverse.common.file.service.impl.FTPFileStoreService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

/**
 * FTP 自动装配
 *
 * @author Clay
 * @date 2023-03-15
 */
@EnableConfigurationProperties({FTPProperties.class})
public class FTPAutoConfiguration {

    @Bean
    public FTPFileService ftpFileService() {
        return new FTPFileService();
    }

    @Bean
    @ConditionalOnMissingBean(FTPClientProvider.class)
    public FTPClientProvider ftpClient() {
        return new FTPClientProvider();
    }

    @Bean("ftpFileStoreService")
    public FTPFileStoreService ftpFileStoreService(FTPFileService ftpFileService) {
        return new FTPFileStoreService(ftpFileService);
    }

}
