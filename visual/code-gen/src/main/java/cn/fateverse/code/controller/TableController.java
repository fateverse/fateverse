package cn.fateverse.code.controller;

import cn.fateverse.code.entity.OptionInfo;
import cn.fateverse.code.entity.TableColumn;
import cn.fateverse.code.entity.dto.ImportDto;
import cn.fateverse.code.entity.dto.TableDto;
import cn.fateverse.code.entity.query.TableQuery;
import cn.fateverse.code.entity.vo.TableInfoVo;
import cn.fateverse.code.entity.vo.TableVo;
import cn.fateverse.code.service.TableService;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.LongUtils;
import cn.fateverse.common.core.utils.ObjectUtils;
import cn.fateverse.common.excel.utils.ExcelUtil;
import cn.fateverse.common.log.annotation.Log;
import cn.fateverse.common.log.enums.BusinessType;
import com.alibaba.fastjson2.JSONObject;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


/**
 * @author Clay
 * @date 2022/11/15
 */
@Api(tags = "数据表格管理")
@RestController
@RequestMapping("/table")
public class TableController {

    private final TableService tableService;

    public TableController(TableService tableService) {
        this.tableService = tableService;
    }

    @ApiOperation("获取list")
    @PreAuthorize("@ss.hasPermission('code:table:list')")
    @GetMapping
    public Result<TableDataInfo<TableVo>> list(TableQuery query) {
        TableDataInfo<TableVo> dataInfo = tableService.searchList(query);
        return Result.ok(dataInfo);
    }

    @ApiOperation("获取list")
    @PreAuthorize("@ss.hasPermission('code:table:export')")
    @GetMapping("/export")
    public void export(TableQuery query) {
        List<TableVo> list = tableService.searchExport(query);
        ExcelUtil.exportExcel(list,TableVo.class);
    }



    @ApiOperation("获取详细信息")
    @PreAuthorize("@ss.hasPermission('code:table:info')")
    @GetMapping("/{tableId}")
    public Result<TableInfoVo> info(@PathVariable Long tableId) {
        LongUtils.checkId(tableId);
        TableDto tableDto = tableService.searchByTableId(tableId);
        if(null == tableDto){
            return Result.error("获取结果为空");
        }
        List<Option> optionList = tableService.searchOptionByDataSourceId(tableDto.getDataSourceId());
        List<TableColumn> columns = tableDto.getColumns();
        tableDto.setColumns(null);
        TableInfoVo tableInfoVo = TableInfoVo.builder()
                .info(tableDto)
                .optionInfo(JSONObject.parseObject(tableDto.getOptionApi(), OptionInfo.class))
                .columns(columns)
                .tableOption(optionList)
                .build();
        return Result.ok(tableInfoVo);
    }

    @ApiOperation("预览代码")
    @GetMapping("/preview/{tableId}")
    @PreAuthorize("@ss.hasPermission('tool:gen:preview')")
    public Result<Map<String, String>> preview(@PathVariable Long tableId) {
        Map<String, String> dataMap = tableService.previewCode(tableId);
        return Result.ok(dataMap);
    }


    @ApiOperation("导入数据源信息")
    @PreAuthorize("@ss.hasPermission('code:table:import')")
    @Log(title = "导入数据源信息", businessType = BusinessType.INSERT)
    @PostMapping("/import-table")
    public Result<Void> importData(@RequestBody ImportDto dto) {
        if (dto.getTables().isEmpty() || LongUtils.isNull(dto.getDataSourceId())) {
            return Result.error("缺少必要参数!");
        }
        return tableService.importTable(dto);
    }

    @ApiOperation("修改数据源信息")
    @PreAuthorize("@ss.hasPermission('code:table:edit')")
    @Log(title = "修改数据源信息", businessType = BusinessType.UPDATE)
    @PutMapping
    public Result<Void> edit(@RequestBody @Validated TableDto table) {
        LongUtils.checkId(table.getTableId());
        tableService.edit(table);
        return Result.ok();
    }

    @ApiOperation("同步数据库")
    @PutMapping("/sync/{tableId}")
    @Log(title = "修改数据源信息", businessType = BusinessType.UPDATE)
    public Result<Void> syncTable(@PathVariable Long tableId){
        if (ObjectUtils.isEmpty(tableId)){
            return Result.error("缺少必要参数!");
        }
        tableService.syncTable(tableId);
        return Result.ok("同步成功");
    }

    @ApiOperation("生成代码-下载")
    @PreAuthorize("@ss.hasPermission('code:table:code')")
    @Log(title = "生成代码-下载", businessType = BusinessType.GENCODE)
    @GetMapping("/download/{tableId}")
    public void download(@PathVariable Long tableId){
        tableService.downloadCode(tableId);
    }

    @ApiOperation("生成代码-下载")
    @PreAuthorize("@ss.hasPermission('code:table:code')")
    @Log(title = "生成代码-下载", businessType = BusinessType.GENCODE)
    @GetMapping("/downloads/{tableIds}")
    public void downloads(@PathVariable List<Long> tableIds){
        if (ObjectUtils.isEmpty(tableIds)){
            throw new CustomException("关键参数不能weikong");
        }
        tableService.downloadCodeList(tableIds);
    }

    @ApiOperation("删除数据源信息")
    @PreAuthorize("@ss.hasPermission('code:table:del')")
    @Log(title = "删除数据源信息", businessType = BusinessType.DELETE)
    @DeleteMapping("/{tableId}")
    public Result<Void> del(@PathVariable Long tableId) {
        LongUtils.checkId(tableId);
        tableService.remove(tableId);
        return Result.ok();
    }

    @ApiOperation("批量删除数据源信息")
    @PreAuthorize("@ss.hasPermission('code:table:del')")
    @Log(title = "删除数据源信息", businessType = BusinessType.DELETE)
    @DeleteMapping
    public Result<Void> delBatch(@RequestParam List<Long> tables) {
        if (null == tables || tables.isEmpty()) {
            return Result.error("缺少必要参数");
        }
        tableService.removeBatch(tables);
        return Result.ok();
    }

}
