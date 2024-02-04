package cn.fateverse.log;

import cn.fateverse.common.security.annotation.EnableSecurity;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * @author Clay
 * @date 2023-05-24
 */
@EnableSecurity
@EnableDiscoveryClient
@SpringBootApplication
public class LogApplication {

    public static void main(String[] args) {
        SpringApplication.run(LogApplication.class, args);
        System.out.println("日志服务启动成功");
    }

}
