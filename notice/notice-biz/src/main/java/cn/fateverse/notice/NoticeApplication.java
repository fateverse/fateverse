package cn.fateverse.notice;

import cn.fateverse.common.security.annotation.EnableSecurity;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * @author Clay
 * @date 2023-04-12
 */
@EnableSecurity
@EnableDiscoveryClient
@SpringBootApplication
public class NoticeApplication {

    public static void main(String[] args) {
        SpringApplication.run(NoticeApplication.class, args);
        System.out.println("notice 服务启动成功");
    }
}
