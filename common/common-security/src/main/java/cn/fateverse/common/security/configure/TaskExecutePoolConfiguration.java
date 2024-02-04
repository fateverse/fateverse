package cn.fateverse.common.security.configure;

import cn.fateverse.common.security.configure.properties.TaskThreadPoolProperties;
import com.alibaba.cloud.nacos.NacosConfigManager;
import com.alibaba.cloud.nacos.NacosConfigProperties;
import com.alibaba.nacos.api.config.listener.Listener;
import com.google.common.util.concurrent.ThreadFactoryBuilder;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import javax.annotation.Resource;
import java.util.concurrent.*;

/**
 * @author Clay
 * @date 2023-08-03
 */
@EnableAsync
@EnableConfigurationProperties({TaskThreadPoolProperties.class})
public class TaskExecutePoolConfiguration implements InitializingBean {


    @Resource
    private TaskThreadPoolProperties properties;

//    private ThreadPoolExecutor executor;

    private ThreadPoolTaskExecutor executor;

    @Resource
    private NacosConfigManager nacosConfigManager;

    @Resource
    private NacosConfigProperties nacosConfigProperties;


    @Bean({"fateverseExecutor","taskExecuteExecutor"})
    public ThreadPoolTaskExecutor taskExecuteExecutor() {
        return executor;
    }


    @Override
    public void afterPropertiesSet() throws Exception {
        executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(properties.getCorePoolSize());
        executor.setMaxPoolSize(properties.getMaxPoolSize());
        executor.setQueueCapacity(properties.getQueueCapacity());
        executor.setKeepAliveSeconds(properties.getKeepAliveSeconds());
        executor.setThreadFactory(new ThreadFactoryBuilder().setNameFormat("fateverse_%d").build());
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
//        executor = new ThreadPoolExecutor(properties.getCorePoolSize(),
//                properties.getMaxPoolSize(),
//                properties.getKeepAliveSeconds(),
//                TimeUnit.SECONDS, new LinkedBlockingDeque<>(properties.getQueueCapacity()),
//                new ThreadFactoryBuilder().setNameFormat("fateverse_%d").build(),
//                new ThreadPoolExecutor.CallerRunsPolicy());
        Environment environment = nacosConfigProperties.getEnvironment();
        String active = environment.getProperty("spring.profiles.active");
        String applicationName = environment.getProperty("spring.application.name");
        String fileExtension = nacosConfigProperties.getFileExtension();
        nacosConfigManager.getConfigService().addListener(applicationName + "-" + active + "." + fileExtension, nacosConfigProperties.getGroup(),
                new Listener() {
                    @Override
                    public Executor getExecutor() {
                        return null;
                    }

                    @Override
                    public void receiveConfigInfo(String configInfo) {
                        
                    }
                });
    }
}
