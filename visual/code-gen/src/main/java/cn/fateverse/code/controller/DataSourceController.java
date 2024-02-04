package cn.fateverse.code.controller;

import cn.fateverse.common.excel.utils.ExcelUtil;
import cn.hutool.core.util.StrUtil;
import cn.fateverse.code.entity.CodeDataSource;
import cn.fateverse.code.entity.dto.DataSourceDto;
import cn.fateverse.code.entity.query.DataSourceQuery;
import cn.fateverse.code.entity.vo.DataSourceVo;
import cn.fateverse.code.enums.DynamicSourceEnum;
import cn.fateverse.code.service.DataSourceService;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.LongUtils;
import cn.fateverse.common.log.annotation.Log;
import cn.fateverse.common.log.enums.BusinessType;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author Clay
 * @date 2022/11/16
 */
@Api(tags = "数据源管理")
@RestController
@RequestMapping("/data-source")
public class DataSourceController {

    private final DataSourceService dataSourceService;


    public DataSourceController(DataSourceService dataSourceService) {
        this.dataSourceService = dataSourceService;
    }


    @ApiOperation("获取数据源信息")
    @GetMapping
    @PreAuthorize("@ss.hasPermission('rapid:data-source:list')")
    public Result<TableDataInfo<DataSourceVo>> list(DataSourceQuery query) {
        TableDataInfo<DataSourceVo> dataInfo = dataSourceService.searchList(query);
        return Result.ok(dataInfo);
    }


    @ApiOperation("导出")
    @PreAuthorize("@ss.hasPermission('rapid:table:export')")
    @GetMapping("/export")
    public void export(DataSourceQuery query) {
        List<DataSourceVo> list = dataSourceService.searchExport(query);
        ExcelUtil.exportExcel(list, DataSourceVo.class);
    }

    @ApiOperation("获取数据源详情")
    @GetMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('rapid:data-source:info')")
    public Result<CodeDataSource> info(
            @ApiParam(name = "id", value = "数据源id")
            @PathVariable Long id) {
        checkDataSourceId(id);
        CodeDataSource codeDataSource = dataSourceService.searchById(id);
        return Result.ok(codeDataSource);
    }

    @ApiOperation("获取option选项接口")
    @GetMapping("/option")
    public Result<List<Option>> option() {
        List<Option> optionList = dataSourceService.searchOption();
        return Result.ok(optionList);
    }

    @ApiOperation("获取数据库适配类型接口")
    @GetMapping("/option/type")
    public Result<List<Option>> optionType() {
        List<Option> optionList = Arrays.stream(DynamicSourceEnum.values()).map(type -> Option.builder()
                .value(type.name())
                .label(type.getType())
                .build()).collect(Collectors.toList());
        return Result.ok(optionList);
    }

    @ApiOperation("新增数据源")
    @PostMapping
    @PreAuthorize("@ss.hasPermission('rapid:data-source:add')")
    @Log(title = "新增数据源", businessType = BusinessType.INSERT)
    public Result<Void> add(@RequestBody @Validated DataSourceDto dataSource) {
        checkDataSource(dataSource);
        if (StrUtil.isEmpty(dataSource.getPassword())) {
            return Result.error("数据库密码不能为空!");
        }
        dataSourceService.save(dataSource);
        return Result.ok();
    }

    @ApiOperation("修改数据源")
    @PutMapping
    @PreAuthorize("@ss.hasPermission('rapid:data-source:edit')")
    @Log(title = "修改数据源", businessType = BusinessType.UPDATE)
    public Result<Void> edit(@RequestBody @Validated DataSourceDto dataSource) {
        checkDataSourceId(dataSource.getDsId());
        checkDataSource(dataSource);
        dataSourceService.edit(dataSource);
        return Result.ok();
    }


    @ApiOperation("删除数据源")
    @DeleteMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('rapid:data-source:del')")
    @Log(title = "删除数据源", businessType = BusinessType.DELETE)
    public Result<Void> delete(@PathVariable Long id) {
        checkDataSourceId(id);
        dataSourceService.removeById(id);
        return Result.ok();
    }

    /**
     * 检查数据源是否正确
     *
     * @param dataSource 数据源
     */
    public void checkDataSource(DataSourceDto dataSource) {
        if (1 == dataSource.getConfType()) {
            if (StrUtil.isEmpty(dataSource.getHost())) {
                throw new CustomException("主机地址不能为空!");
            }
            if (null == dataSource.getPort()) {
                throw new CustomException("主机端口不能为空!");
            }
            if (StrUtil.isEmpty(dataSource.getDbName())) {
                throw new CustomException("数据库名称不能为空!");
            }
        } else {
            if (StrUtil.isEmpty(dataSource.getJdbcUrl())) {
                throw new CustomException("数据库连接地址不能为空!");
            }
        }
    }


    /**
     * 检查部门id是都为空
     */
    private void checkDataSourceId(Long id) {
        LongUtils.checkId(id, "数据源id不能为空!");
    }


}
