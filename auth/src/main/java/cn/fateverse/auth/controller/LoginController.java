package cn.fateverse.auth.controller;

import cn.fateverse.admin.vo.RouterVo;
import cn.fateverse.auth.entity.UserInfo;
import cn.fateverse.auth.entity.LoginBody;
import cn.fateverse.auth.service.LoginService;
import cn.fateverse.common.core.result.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Clay
 * @date 2022/10/27
 */
@Api(tags = "登录")
@RestController
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @ApiOperation("登录")
    @PostMapping("/login")
    public Result<String> login(@Validated @RequestBody LoginBody login) {
        return Result.ok("登录成功",loginService.login(login));
    }

    @ApiOperation("登出")
    @PostMapping("/logout")
    public Result<String> logout(){
        loginService.logout();
        return Result.ok("登出成功");
    }

    @ApiOperation("获取用户信息")
    @GetMapping("/info")
    public Result<UserInfo> info() {
        return Result.ok(loginService.getInfo());
    }

    @ApiOperation("获取用户菜单信息")
    @GetMapping("/router")
    public Result<List<RouterVo>> router() {
        return Result.ok(loginService.getMenuRouterByUserId());
    }

    // todo 王阳蓝
    //phone
    //mail 邮件
    //sms 短信 阿里大鱼
    //qq
    //wechat
    //wechat 小程序
}
