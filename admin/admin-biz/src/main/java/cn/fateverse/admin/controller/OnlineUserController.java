package cn.fateverse.admin.controller;

import cn.fateverse.admin.entity.OnlineUser;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.hutool.core.util.StrUtil;
import cn.fateverse.admin.service.OnlineUserService;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.log.annotation.Log;
import cn.fateverse.common.log.enums.BusinessType;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/12
 */
@Api(tags = "在线用户")
@RestController
@RequestMapping("/online/user")
public class OnlineUserController {

    private final OnlineUserService onlineUserService;

    public OnlineUserController(OnlineUserService onlineUserService) {
        this.onlineUserService = onlineUserService;
    }


    @GetMapping
    @ApiOperation("获取在线用户信息")
    @PreAuthorize("@ss.hasPermission('admin:online:list')")
    public Result<TableDataInfo<OnlineUser>> list(
            @ApiParam(name="place",value="登录地点") String place,
            @ApiParam(name="username",value="登录名称") String username){
        TableDataInfo<OnlineUser> tableDataInfo = onlineUserService.searchList(place, username);
        return Result.ok(tableDataInfo);
    }


    @DeleteMapping("/{tokenId}")
    @ApiOperation("强制退出用户")
    @PreAuthorize("@ss.hasPermission('admin:online:force')")
    @Log(title = "强制退出用户",businessType = BusinessType.FORCE)
    public Result<Void> force(@PathVariable String tokenId){
        if (StrUtil.isEmpty(tokenId)){
            return Result.error("必要参数为空!");
        }
        onlineUserService.force(tokenId);
        return Result.ok();
    }



}
