package cn.fateverse.common.code;

import cn.fateverse.common.code.config.JavaCodeProperties;
import cn.fateverse.common.code.engine.JavaCodeEngine;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

/**
 * @author Clay
 * @date 2023-10-30  23:09
 */
@EnableConfigurationProperties({JavaCodeProperties.class})
public class JavaCodeAutoConfiguration {

    @Bean
    public JavaCodeEngine javaCodeEngine(JavaCodeProperties javaCodeProperties){
        return new JavaCodeEngine(javaCodeProperties);
    }


}
