package cn.fateverse.code.controller;

import cn.fateverse.code.entity.query.DynamicTable;
import cn.fateverse.code.service.DynamicTableMetadataService;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.LongUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * @author Clay
 * @date 2022/11/17
 */
@Api(tags = "代码生成:数据表源信息")
@RestController
@RequestMapping("/dynamic-table")
public class DynamicTableController {

    private final DynamicTableMetadataService tableSourceService;

    public DynamicTableController(DynamicTableMetadataService tableSourceService) {
        this.tableSourceService = tableSourceService;
    }


    @ApiOperation("获取数据源信息")
    @GetMapping
    @PreAuthorize("@ss.hasPermission('code:dynamic-table:list')")
    public Result<TableDataInfo<DynamicTable>> list(DynamicTable dynamicTable, Long dataSourceId) {
        if (LongUtils.isNull(dataSourceId)){
            return Result.error("数据源id不能为空!");
        }
        TableDataInfo<DynamicTable> dataInfo = tableSourceService.searchList(dynamicTable, dataSourceId);
        return Result.ok(dataInfo);
    }


}
