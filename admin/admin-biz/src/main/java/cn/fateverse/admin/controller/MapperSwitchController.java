package cn.fateverse.admin.controller;

import cn.fateverse.admin.dto.MappingSwitchDto;
import cn.fateverse.admin.entity.vo.MappingSwitchVo;
import cn.fateverse.admin.query.MappingSwitchQuery;
import cn.fateverse.admin.service.MappingSwitchService;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.result.page.TableDataInfo;
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
    @PreAuthorize("@ss.hasPermission('admin:mappingswitch:list')")
    public Result<TableDataInfo<MappingSwitchVo>> list(MappingSwitchQuery query) {
        TableDataInfo<MappingSwitchVo> search = mappingSwitchService.search(query);
        return Result.ok(search);
    }

    @ApiOperation("修改开关状态")
    @PutMapping
    @PreAuthorize("@ss.hasPermission('admin:mappingswitch:update')")
    public Result<Void> update(@RequestBody @Validated MappingSwitchDto dto) {
        mappingSwitchService.update(dto);
        return Result.ok();
    }

}
