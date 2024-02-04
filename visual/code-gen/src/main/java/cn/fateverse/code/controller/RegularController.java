package cn.fateverse.code.controller;

import cn.fateverse.code.entity.dto.RegularDto;
import cn.fateverse.code.entity.query.RegularQuery;
import cn.fateverse.code.entity.vo.RegularVo;
import cn.fateverse.code.service.RegularService;
import cn.fateverse.common.core.entity.Option;
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
import java.util.regex.Pattern;

/**
 * 校验规则表 Controller
 *
 * @author clay
 * @date 2023-05-27
 */
@Api(value = "校验规则表管理",tags = "校验规则表管理")
@RestController
@RequestMapping("/rapid/regular")
public class RegularController {

    private final RegularService regularService;

    public RegularController(RegularService regularService) {
        this.regularService = regularService;
    }


    @ApiOperation("获取校验规则表列表")
    @GetMapping
    @PreAuthorize("@ss.hasPermission('rapid:regular:list')")
    public Result<TableDataInfo<RegularVo>> list(RegularQuery query) {
        TableDataInfo<RegularVo> dataInfo = regularService.searchList(query);
        return Result.ok(dataInfo);
    }

    @ApiOperation("获取校验规则表列表")
    @GetMapping("/option")
    public Result<List<Option>> option(){
        List<Option> options = regularService.searchOptionList();
        return Result.ok(options);
    }

    @ApiOperation("导出excel数据")
    @GetMapping("/export")
    @PreAuthorize("@ss.hasPermission('rapid:regular:export')")
    public void export(RegularQuery query){
        List<RegularVo> list = regularService.exportList(query);
        ExcelUtil.exportExcel(list, RegularVo.class);
    }

    @ApiOperation("获取校验规则表详细信息")
    @GetMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('rapid:regular:info')")
    public Result<RegularVo> info(@PathVariable Long id) {
        ObjectUtils.checkPk(id);
        RegularVo regular = regularService.searchById(id);
        return Result.ok(regular);
    }

    @ApiOperation("新增校验规则表")
    @PostMapping
    @Log(title = "新增校验规则表",businessType = BusinessType.INSERT)
    @PreAuthorize("@ss.hasPermission('rapid:regular:add')")
    public Result<Void> add(@RequestBody @Validated RegularDto regular){
        if (!verifyRegular(regular)) {
            return Result.error("正则表达式校验不通过!");
        }
        regularService.save(regular);
        return Result.ok();
    }

    @ApiOperation("修改校验规则表")
    @PutMapping
    @Log(title = "修改校验规则表",businessType = BusinessType.UPDATE)
    @PreAuthorize("@ss.hasPermission('rapid:regular:edit')")
    public Result<Void> edit(@RequestBody @Validated RegularDto regular){
        ObjectUtils.checkPk(regular.getId());
        if (!verifyRegular(regular)) {
            return Result.error("正则表达式校验不通过!");
        }
        regularService.edit(regular);
        return Result.ok();
    }

    @ApiOperation("删除校验规则表")
    @DeleteMapping("/{idList}")
    @Log(title = "删除校验规则表",businessType = BusinessType.DELETE)
    @PreAuthorize("@ss.hasPermission('rapid:regular:del')")
    public Result<Void> batchDel(@PathVariable List<Long> idList){
        ObjectUtils.checkPkList(idList);
        regularService.removeBatch(idList);
        return Result.ok();
    }

    public boolean verifyRegular(RegularDto regular) {
        return Pattern.matches(regular.getRegular(), regular.getValidation());
    }

}
