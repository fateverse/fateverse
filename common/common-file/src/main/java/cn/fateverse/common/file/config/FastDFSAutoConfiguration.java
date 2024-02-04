package cn.fateverse.common.file.config;

import cn.fateverse.common.file.service.impl.FastDFSStoreService;
import com.github.tobato.fastdfs.FdfsClientConfig;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableMBeanExport;
import org.springframework.context.annotation.Import;
import org.springframework.jmx.support.RegistrationPolicy;

@Import(FdfsClientConfig.class)
@EnableMBeanExport(registration = RegistrationPolicy.IGNORE_EXISTING)
@EnableConfigurationProperties({FastDFSProperties.class})
public class FastDFSAutoConfiguration {

    @Bean("fastDFSStoreService")
    public FastDFSStoreService fastDFSStoreService(){
        return new FastDFSStoreService();
    }

}
