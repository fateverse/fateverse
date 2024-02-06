package cn.fateverse.notice.config;

import cn.fateverse.notice.netty.NettyApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Netty Websocket服务配置类
 *
 * @author Clay
 * @date 2023-04-14
 */
@Configuration
@EnableConfigurationProperties({NoticeProperties.class})
public class NettyWebSocketConfiguration {


    @Bean
    NettyApplication nettyApplication() {
        return new NettyApplication();
    }
}
