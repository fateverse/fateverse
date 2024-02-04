package cn.fateverse.admin.controller;

import cn.fateverse.admin.dto.ConfigDto;
import cn.fateverse.admin.query.ConfigQuery;
import cn.fateverse.admin.vo.ConfigVo;
import cn.fateverse.admin.service.ConfigService;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.ObjectUtils;
import cn.fateverse.common.excel.utils.ExcelUtil;
import cn.fateverse.common.log.annotation.Log;
import cn.fateverse.common.log.enums.BusinessType;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 参数配置表 Controller
 *
 * @author clay
 * @date 2023-06-09
 */
@Api(value = "参数配置表管理",tags = "参数配置表管理")
@RestController
@RequestMapping("/config")
public class ConfigController {

    private final ConfigService configService;

    public ConfigController(ConfigService configService) {
        this.configService = configService;
    }


    @ApiOperation("获取参数配置表列表")
    @GetMapping
    @PreAuthorize("@ss.hasPermission('admin:config:list')")
    public Result<TableDataInfo<ConfigVo>> list(ConfigQuery query) {
        TableDataInfo<ConfigVo> dataInfo = configService.searchList(query);
        return Result.ok(dataInfo);
    }
    @ApiOperation("获取参数配置表列表Page")
    @GetMapping("/page")
    @PreAuthorize("@ss.hasPermission('admin:config:list')")
    public Result<TableDataInfo<ConfigVo>> listPage(ConfigQuery query) {
        TableDataInfo<ConfigVo> dataInfo = configService.searchListPage(query);
        return Result.ok(dataInfo);
    }


    @ApiOperation("导出excel数据")
    @GetMapping("/export")
    @PreAuthorize("@ss.hasPermission('admin:config:export')")
    public void export(ConfigQuery query){
        List<ConfigVo> list = configService.exportList(query);
        ExcelUtil.exportExcel(list,ConfigVo.class);
    }

    @ApiOperation("获取参数配置表详细信息")
    @GetMapping("/{configId}")
    @PreAuthorize("@ss.hasPermission('admin:config:info')")
    public Result<ConfigVo> info(@PathVariable Integer configId) {
        ObjectUtils.checkPk(configId);
        ConfigVo config = configService.searchById(configId);
        return Result.ok(config);
    }


    @ApiOperation("新增参数配置表")
    @PostMapping
    @Log(title = "新增参数配置表",businessType = BusinessType.INSERT)
    @PreAuthorize("@ss.hasPermission('admin:config:add')")
    public Result<Void> add(@RequestBody @Validated ConfigDto config){
        configService.save(config);
        return Result.ok();
    }

    @ApiOperation("修改参数配置表")
    @PutMapping
    @Log(title = "修改参数配置表",businessType = BusinessType.UPDATE)
    @PreAuthorize("@ss.hasPermission('admin:config:edit')")
    public Result<Void> edit(@RequestBody @Validated ConfigDto config){
        ObjectUtils.checkPk(config.getConfigId());
        configService.edit(config);
        return Result.ok();
    }

    @ApiOperation("删除参数配置表")
    @DeleteMapping("/{configIdList}")
    @Log(title = "删除参数配置表",businessType = BusinessType.DELETE)
    @PreAuthorize("@ss.hasPermission('admin:config:del')")
    public Result<Void> batchDel(@PathVariable List<Integer> configIdList){
        ObjectUtils.checkPkList(configIdList);
        configService.removeBatch(configIdList);
        return Result.ok();
    }

}