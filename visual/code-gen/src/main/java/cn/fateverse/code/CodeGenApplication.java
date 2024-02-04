package cn.fateverse.code;

import cn.fateverse.common.security.annotation.EnableSecurity;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * @author Clay
 * @date 2022/11/10
 */
@EnableSecurity
@EnableDiscoveryClient
@SpringBootApplication
public class CodeGenApplication {
    public static void main(String[] args) {
        SpringApplication.run(CodeGenApplication.class, args);
        System.out.println("代码生成模块启动成功");
    }
}
