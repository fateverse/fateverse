package cn.fateverse.admin.controller;

import cn.fateverse.admin.entity.dto.MappingSwitchDto;
import cn.fateverse.admin.entity.vo.MappingSwitchVo;
import cn.fateverse.admin.query.MappingSwitchQuery;
import cn.fateverse.admin.service.MappingSwitchService;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.decrypt.annotation.Encrypt;
import cn.fateverse.common.log.annotation.Log;
import cn.fateverse.common.log.enums.BusinessType;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * @author Clay
 * @date 2024/2/5 14:19
 */
@Api(tags = "接口开关")
@RestController
@RequestMapping("/mapping/switch")
public class MapperSwitchController {

    private final MappingSwitchService mappingSwitchService;


    public MapperSwitchController(MappingSwitchService mappingSwitchService) {
        this.mappingSwitchService = mappingSwitchService;
    }


    @ApiOperation("获取接口开关列表")
    @GetMapping
    @Encrypt
    @PreAuthorize("@ss.hasPermission('mapping:switch:list')")
    public Result<TableDataInfo<MappingSwitchVo>> list(MappingSwitchQuery query) {
        TableDataInfo<MappingSwitchVo> search = mappingSwitchService.search(query);
        return Result.ok(search);
    }

    @ApiOperation("修改开关状态")
    @PutMapping
    @Encrypt
    @PreAuthorize("@ss.hasPermission('mapping:switch:update')")
    @Log(title = "修改开关状态", businessType = BusinessType.UPDATE)
    public Result<Void> update(@RequestBody @Validated MappingSwitchDto dto) {
        mappingSwitchService.update(dto);
        return Result.ok();
    }

}
