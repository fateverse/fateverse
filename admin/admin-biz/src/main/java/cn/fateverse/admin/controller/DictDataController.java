package cn.fateverse.admin.controller;

import cn.fateverse.admin.dto.DictDataDto;
import cn.fateverse.admin.query.DictDataQuery;
import cn.fateverse.admin.vo.DictDataSimpVo;
import cn.fateverse.admin.vo.DictDataVo;
import cn.hutool.core.util.StrUtil;
import cn.fateverse.admin.service.DictDataService;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.LongUtils;
import cn.fateverse.common.core.utils.ObjectUtils;
import cn.fateverse.common.log.annotation.Log;
import cn.fateverse.common.log.enums.BusinessType;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * @author Clay
 * @date 2022/11/9
 */
@Api(tags = "字典数据管理")
@RestController
@RequestMapping("/dict/data")
public class DictDataController {
    private final DictDataService dictDataService;

    public DictDataController(DictDataService dictDataService) {
        this.dictDataService = dictDataService;
    }

    @ApiOperation("根据type名称获取缓存字典数据")
    @GetMapping("/type/{cacheKeys}")
    public Result<Map<String,List<DictDataSimpVo>>> cacheType(@PathVariable List<String> cacheKeys){
        if (ObjectUtils.isEmpty(cacheKeys)){
            return Result.error("关键参数不能为空!");
        }
        Map<String,List<DictDataSimpVo>> dictData = dictDataService.get(cacheKeys);
        return Result.ok(dictData);
    }

    @ApiOperation("根据type名称获取缓存字典数据")
    @GetMapping("/option/{cacheKey}")
    public Result<List<Option>> cacheOption(@PathVariable String cacheKey){
        if (StrUtil.isEmpty(cacheKey)){
            return Result.error("关键参数不能为空!");
        }
        List<Option> optionList = dictDataService.option(cacheKey);
        return Result.ok(optionList);
    }


    @ApiOperation("获取字典数据")
    @GetMapping
    @PreAuthorize("@ss.hasPermission('dict:data:list')")
    public Result<TableDataInfo<DictDataVo>> list(DictDataQuery query){
        if (StrUtil.isEmpty(query.getDictType())){
            return Result.error("字典名称不能为空!");
        }
        TableDataInfo<DictDataVo> tableData = dictDataService.searchList(query);
        return Result.ok(tableData);
    }

    @ApiOperation("查询字典数据详情")
    @GetMapping("/{dictCode}")
    @PreAuthorize("@ss.hasPermission('dict:data:info')")
    public Result<DictDataVo> info(@PathVariable Long dictCode){
        LongUtils.checkId(dictCode);
        DictDataVo dictData = dictDataService.searchByCode(dictCode);
        return Result.ok(dictData);
    }

    @ApiOperation("新增字典数据")
    @PostMapping
    @Log(title = "新增字典类型",businessType = BusinessType.INSERT)
    @PreAuthorize("@ss.hasPermission('dict:data:add')")
    public Result<Void> add(@RequestBody @Validated DictDataDto dto){
        dictDataService.save(dto);
        return Result.ok();
    }

    @ApiOperation("修改字典数据")
    @PutMapping
    @Log(title = "修改字典类型",businessType = BusinessType.UPDATE)
    @PreAuthorize("@ss.hasPermission('dict:data:edit')")
    public Result<Void> edit(@RequestBody @Validated DictDataDto dto){
        LongUtils.checkId(dto.getDictCode());
        dictDataService.edit(dto);
        return Result.ok();
    }

    @ApiOperation("删除字典数据")
    @DeleteMapping("/{dictCode}")
    @Log(title = "删除字典类型",businessType = BusinessType.DELETE)
    @PreAuthorize("@ss.hasPermission('dict:data:del')")
    public Result<Void> del(@PathVariable Long dictCode){
        LongUtils.checkId(dictCode);
        dictDataService.removeByCode(dictCode);
        return Result.ok();
    }

    @ApiOperation("删除字典数据")
    @DeleteMapping
    @Log(title = "删除字典类型",businessType = BusinessType.DELETE)
    @PreAuthorize("@ss.hasPermission('dict:data:del')")
    public Result<Void> batchDel(@RequestParam List<Long> dictCodeList){
        if (null == dictCodeList|| dictCodeList.isEmpty()){
            return Result.error("缺少必要参数!");
        }
        dictDataService.removeBatch(dictCodeList);
        return Result.ok();
    }

}
