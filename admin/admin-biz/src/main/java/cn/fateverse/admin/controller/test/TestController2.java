package cn.fateverse.admin.controller.test;

import cn.fateverse.common.security.annotation.Anonymity;
import cn.fateverse.common.security.annotation.MappingSwitch;
import org.springframework.web.bind.annotation.*;

/**
 * @author Clay
 * @date 2024/2/5 15:03
 */
@MappingSwitch("测试类开关")
@RestController
@RequestMapping("/test2")
public class TestController2 {


    @Anonymity
    @GetMapping
    public String test() {
        return "test";
    }


}
