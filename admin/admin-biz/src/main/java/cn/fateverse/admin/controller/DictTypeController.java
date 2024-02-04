package cn.fateverse.admin.controller;

import cn.fateverse.admin.dto.DictTypeDto;
import cn.fateverse.admin.query.DictTypeQuery;
import cn.fateverse.admin.entity.DictType;
import cn.fateverse.admin.service.DictTypeService;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.LongUtils;
import cn.fateverse.common.log.annotation.Log;
import cn.fateverse.common.log.enums.BusinessType;
import cn.fateverse.common.mybatis.utils.PageUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.BeanUtils;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/9
 */
@Api(tags = "字典类型管理")
@RestController
@RequestMapping("/dict/type")
public class DictTypeController {


    private final DictTypeService dictTypeService;

    public DictTypeController(DictTypeService dictTypeService) {
        this.dictTypeService = dictTypeService;
    }

    @ApiOperation("获取字典类型")
    @GetMapping
    @PreAuthorize("@ss.hasPermission('admin:dict:list')")
    public Result<TableDataInfo<DictType>> list(DictTypeQuery query){
        PageUtils.startPage();
        List<DictType> dictTypeList = dictTypeService.searchList(query);
        TableDataInfo<DictType> dataTable = PageUtils.getDataTable(dictTypeList);
        return Result.ok(dataTable);
    }


    @ApiOperation("查询字典类型Option")
    @GetMapping("/option")
    public Result<List<Option>> option(){
        List<Option> optionList = dictTypeService.searchOption();
        return Result.ok(optionList);
    }

    @ApiOperation("查询字典类型详情")
    @GetMapping("/{dictId}")
    @PreAuthorize("@ss.hasPermission('admin:dict:info')")
    public Result<DictType> info(@PathVariable Long dictId){
        LongUtils.checkId(dictId);
        DictType dictType = dictTypeService.searchById(dictId);
        return Result.ok(dictType);
    }

    @ApiOperation("新增字典类型")
    @PostMapping
    @Log(title = "新增字典类型",businessType = BusinessType.INSERT)
    @PreAuthorize("@ss.hasPermission('admin:dict:add')")
    public Result<Void> add(@RequestBody @Validated DictType dictType){
        dictTypeService.save(dictType);
        return Result.ok();
    }

    @ApiOperation("修改字典类型")
    @PutMapping
    @Log(title = "修改字典类型",businessType = BusinessType.UPDATE)
    @PreAuthorize("@ss.hasPermission('admin:dict:edit')")
    public Result<Void> edit(@RequestBody @Validated DictTypeDto dictTypeDto){
        DictType dictType = new DictType();
        BeanUtils.copyProperties(dictTypeDto,dictType);
        LongUtils.checkId(dictType.getDictId());
        dictTypeService.edit(dictType);
        return Result.ok();
    }

    @ApiOperation("删除字典类型")
    @DeleteMapping("/{dictId}")
    @Log(title = "删除字典类型",businessType = BusinessType.DELETE)
    @PreAuthorize("@ss.hasPermission('admin:dict:del')")
    public Result<Void> del(@PathVariable Long dictId){
        LongUtils.checkId(dictId);
        dictTypeService.removeById(dictId);
        return Result.ok();
    }



}
