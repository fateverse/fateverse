package cn.fateverse.admin.controller.test;

import cn.fateverse.common.security.annotation.Anonymity;
import cn.fateverse.common.security.annotation.MappingSwitch;
import org.springframework.web.bind.annotation.*;

/**
 * @author Clay
 * @date 2024/2/5 15:03
 */
@RestController
@RequestMapping("/test1")
public class TestController1 {


    @MappingSwitch("测试开关")
    @Anonymity
    @GetMapping
    public String test() {
        return "test";
    }


    @MappingSwitch
    @Anonymity
    @GetMapping("/test1")
    public String test1() {
        return "test";
    }


    @MappingSwitch
    @Anonymity
    @GetMapping("/test2")
    public String test2() {
        return "test";
    }


    @MappingSwitch
    @Anonymity
    @GetMapping("/test3")
    public String test3() {
        return "test";
    }


    @MappingSwitch
    @Anonymity
    @GetMapping("/test4")
    public String test4() {
        return "test";
    }


    @MappingSwitch
    @Anonymity
    @PostMapping("/test5")
    public String test5() {
        return "test";
    }


    @MappingSwitch
    @Anonymity
    @PutMapping("/test6")
    public String test6() {
        return "test";
    }


    @MappingSwitch
    @Anonymity
    @DeleteMapping("/test7")
    public String test7() {
        return "test";
    }


}
