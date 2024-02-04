package cn.fateverse.admin.controller;

import cn.fateverse.admin.dto.IpBackDto;
import cn.fateverse.admin.query.IpBackQuery;
import cn.fateverse.admin.service.IpBackService;
import cn.fateverse.admin.vo.IpBackVo;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.ObjectUtils;
import cn.fateverse.common.log.annotation.Log;
import cn.fateverse.common.log.enums.BusinessType;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Clay
 * @date 2023-10-22
 */
@Api(value = "ip黑名单", tags = "ip黑名单")
@RestController
@RequestMapping("/ip/back")
public class IpBackController {

    private final IpBackService ipBackService;


    public IpBackController(IpBackService ipBackService) {
        this.ipBackService = ipBackService;
    }


    @ApiOperation("获取ip黑名单")
    @GetMapping
    @PreAuthorize("@ss.hasPermission('admin:ipback:list')")
    public Result<TableDataInfo<IpBackVo>> list(IpBackQuery query) {
        TableDataInfo<IpBackVo> search = ipBackService.search(query);
        return Result.ok(search);
    }

    @ApiOperation("导出excel数据")
    @GetMapping("/export")
    @PreAuthorize("@ss.hasPermission('admin:ipback:export')")
    public void export(IpBackQuery query) {
        //List<IpBackVo> list = configService.exportList(query);
        //ExcelUtil.exportExcel(list,ConfigVo.class);
    }

    @ApiOperation("获取ip黑名单详细信息")
    @GetMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('admin:ipback:info')")
    public Result<IpBackVo> info(@PathVariable Long id) {
        ObjectUtils.checkPk(id);
        IpBackVo ipBackVo = ipBackService.searchById(id);
        return Result.ok(ipBackVo);
    }


    @ApiOperation("新增ip黑名单")
    @PostMapping
    @Log(title = "新增ip黑名单", businessType = BusinessType.INSERT)
    @PreAuthorize("@ss.hasPermission('admin:ipback:add')")
    public Result<Void> add(@RequestBody @Validated IpBackDto ipBackDto) {
        ipBackService.save(ipBackDto);
        return Result.ok();
    }

    @ApiOperation("修改ip黑名单")
    @PutMapping
    @Log(title = "修改ip黑名单", businessType = BusinessType.UPDATE)
    @PreAuthorize("@ss.hasPermission('admin:ipback:edit')")
    public Result<Void> edit(@RequestBody @Validated IpBackDto ipBackDto) {
        ObjectUtils.checkPk(ipBackDto.getId());
        ipBackService.edit(ipBackDto);
        return Result.ok();
    }

    @ApiOperation("删除ip黑名单")
    @DeleteMapping("/{ids}")
    @Log(title = "删除ip黑名单", businessType = BusinessType.DELETE)
    @PreAuthorize("@ss.hasPermission('admin:ipback:del')")
    public Result<Void> batchDel(@PathVariable List<Long> ids) {
        ObjectUtils.checkPkList(ids);
        ipBackService.delete(ids);
        return Result.ok();
    }


}
