package cn.fateverse.log.controller;

import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.decrypt.annotation.Encrypt;
import cn.fateverse.common.security.annotation.Anonymity;
import cn.fateverse.log.query.LoginLogQuery;
import cn.fateverse.log.service.LoginInfoService;
import cn.fateverse.log.vo.LoginInfoVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


/**
 * @author Clay
 * @date 2022/11/2
 */
@Api(tags = "登录日志管理")
@Anonymity
@RestController
@RequestMapping("/login-info")
public class LoginInfoController {

    private final LoginInfoService loginInfoService;


    public LoginInfoController(LoginInfoService loginInfoService) {
        this.loginInfoService = loginInfoService;
    }

    /**
     *  查询登录日志信息
     * @param loginLogQuery
     * @return
     */

    @GetMapping("/list")
    @ApiOperation("查询日志信息")
    @PreAuthorize("@ss.hasPermission('admin:log:list')")
    public Result<TableDataInfo<LoginInfoVo>> loginSearch(LoginLogQuery loginLogQuery){
        TableDataInfo<LoginInfoVo> dataTable = loginInfoService.search(loginLogQuery);
        return Result.ok(dataTable);
    }

    /**
     * 删除登录日志 单个/批量
     * @param infoIds
     * @return
     */
    @DeleteMapping("/{infoIds}")
    @ApiOperation("登录日志删除")
    @PreAuthorize("@ss.hasPermission('admin:log:del')")
    public Result<Void> loginRemove(@PathVariable Long[] infoIds){
        if (infoIds.length==0){
            return Result.error("id不能为空");
        }
        loginInfoService.delete(infoIds);
        return Result.ok();
    }

    /**
     * 根据id 查询日志详细信息
     * @param infoId
     * @return
     */
    @Encrypt
    @GetMapping("/{infoId}")
    @ApiOperation("查询登录日志")
    @PreAuthorize("@ss.hasPermission('admin:log:query')")
    public Result<LoginInfoVo> getInfo(@PathVariable("infoId") Long infoId){
        LoginInfoVo loginInfo = loginInfoService.select(infoId);
        return Result.ok(loginInfo);
    }


}
