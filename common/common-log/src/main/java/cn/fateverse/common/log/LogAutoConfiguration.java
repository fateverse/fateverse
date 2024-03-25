package cn.fateverse.common.log;

import cn.fateverse.common.log.aspect.LogAspect;
import cn.fateverse.common.log.config.OperationProperties;
import cn.fateverse.common.log.service.OperationService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;


/**
 * @author Clay
 * @date 2023-05-21
 */
@ConditionalOnWebApplication
@EnableConfigurationProperties({OperationProperties.class})
public class LogAutoConfiguration {

    @Bean
    public LogAspect logAspect() {
        return new LogAspect();
    }

    @Bean
    public OperationService operationService(OperationProperties properties, Environment environment) {
        return new OperationService(properties, environment);
    }

}
