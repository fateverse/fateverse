package cn.fateverse.common.seata;

import io.seata.spring.annotation.datasource.EnableAutoDataSourceProxy;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

/**
 * @author Clay
 * @date 2023-08-08
 */
@PropertySource(value = "classpath:seata-config.yml")
@EnableAutoDataSourceProxy
@Configuration(proxyBeanMethods = false)
public class SeataAutoConfiguration {
}
