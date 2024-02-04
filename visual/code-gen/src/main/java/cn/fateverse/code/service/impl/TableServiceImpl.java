package cn.fateverse.code.service.impl;

import cn.hutool.core.util.StrUtil;
import cn.fateverse.code.entity.OptionInfo;
import cn.fateverse.code.entity.Table;
import cn.fateverse.code.entity.TableColumn;
import cn.fateverse.code.entity.bo.TableGenBo;
import cn.fateverse.code.entity.dto.ImportDto;
import cn.fateverse.code.entity.dto.TableDto;
import cn.fateverse.code.entity.query.TableQuery;
import cn.fateverse.code.entity.vo.TableVo;
import cn.fateverse.code.mapper.TableColumnMapper;
import cn.fateverse.code.mapper.TableMapper;
import cn.fateverse.code.service.DynamicTableMetadataService;
import cn.fateverse.code.service.TableService;
import cn.fateverse.code.util.velocity.VelocityInitializer;
import cn.fateverse.code.util.velocity.VelocityUtils;
import cn.fateverse.common.core.constant.Constants;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.HttpServletUtils;
import cn.fateverse.common.mybatis.utils.PageUtils;
import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.Velocity;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * @author Clay
 * @date 2022/11/17
 */
@Slf4j
@Service
public class TableServiceImpl implements TableService {

    private final TableMapper tableMapper;

    private final DynamicTableMetadataService dynamicTableMetadataService;

    private final TableColumnMapper tableColumnMapper;

    public TableServiceImpl(TableMapper tableMapper,
                            TableColumnMapper tableColumnMapper,
                            DynamicTableMetadataService dynamicTableMetadataService) {
        this.tableMapper = tableMapper;
        this.tableColumnMapper = tableColumnMapper;
        this.dynamicTableMetadataService = dynamicTableMetadataService;
    }


    @Override
    public TableDataInfo<TableVo> searchList(TableQuery query) {
        PageUtils.startPage();
        List<Table> tableList = tableMapper.selectTableList(query);
        return PageUtils.convertDataTable(tableList, Table::toTableVo);
    }

    @Override
    public List<TableVo> searchExport(TableQuery query) {
        List<Table> tableList = tableMapper.selectTableList(query);
        return tableList.stream().map(Table::toTableVo).collect(Collectors.toList());
    }

    @Override
    public TableDto searchByTableId(Long tableId) {
        return tableMapper.selectTableDtoByTableId(tableId);
    }

    @Override
    public List<Option> searchOptionByDataSourceId(Long dataSourceId) {
        TableQuery query = new TableQuery();
        query.setDataSourceId(dataSourceId);
        List<Table> tableList = tableMapper.selectTableList(query);
        return tableList.stream().map(table ->
                Option.builder()
                        .value(table.getTableId())
                        .label(table.getTableName() + ":" + table.getTableComment())
                        .build()
        ).collect(Collectors.toList());
    }

    @Override
    public Map<String, String> previewCode(Long tableId) {
        Map<String, String> dataMap = new LinkedHashMap<>();
        TableGenBo table = getTableGenBo(tableId, "代码预览失败!");
        VelocityInitializer.initVelocity();
        VelocityContext context = VelocityUtils.prepareContext(table);
        List<String> templateList = VelocityUtils.getTemplateList(table);
        for (String template : templateList) {
            StringWriter sw = new StringWriter();
            Template tpl = Velocity.getTemplate(template, Constants.UTF8);
            tpl.merge(context, sw);
            dataMap.put(VelocityUtils.getPreviewName(template, table.getClassName()), sw.toString());
        }
        return dataMap;
    }

    @Override
    public void downloadCode(Long tableId) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ZipOutputStream zip = new ZipOutputStream(outputStream);
        generatorCode(tableId, zip);
        IOUtils.closeQuietly(zip);
        downloadZip(outputStream);
    }

    @Override
    public void downloadCodeList(List<Long> tableIds) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ZipOutputStream zip = new ZipOutputStream(outputStream);
        for (Long tableId : tableIds) {
            generatorCode(tableId, zip);
        }
        IOUtils.closeQuietly(zip);
        downloadZip(outputStream);
    }

    private void generatorCode(Long tableId, ZipOutputStream zip) {
        TableGenBo table = getTableGenBo(tableId, "代码生成失败");
        VelocityInitializer.initVelocity();
        VelocityContext context = VelocityUtils.prepareContext(table);
        List<String> templateList = VelocityUtils.getTemplateList(table);
        for (String template : templateList) {
            StringWriter sw = new StringWriter();
            Template tpl = Velocity.getTemplate(template, Constants.UTF8);
            tpl.merge(context, sw);
            try {
                zip.putNextEntry(new ZipEntry(VelocityUtils.getFileName(template, table)));
                IOUtils.write(sw.toString(), zip, Constants.UTF8);
                sw.close();
                zip.flush();
                zip.closeEntry();
            } catch (IOException e) {
                log.error("渲染模板失败，表名：" + table.getTableName(), e);
            }
        }
    }

    /**
     * 获取到代码生成需要的业务数据
     *
     * @param tableId 表格id
     * @param msg     错误信息
     * @return 业务数据
     */
    private TableGenBo getTableGenBo(Long tableId, String msg) {
        TableDto tableDto = tableMapper.selectTableDtoByTableId(tableId);
        if (null == tableDto) {
            throw new CustomException(msg);
        }
        if (StrUtil.isEmpty(tableDto.getServiceName())) {
            tableDto.setServiceName("demo");
        }
        TableGenBo table = new TableGenBo();
        BeanUtils.copyProperties(tableDto, table);
        table.setOptionInfo(JSONObject.parseObject(table.getOptionApi(), OptionInfo.class));
        setPKColumn(table);
        return table;
    }

    /**
     * 设置主键列信息
     *
     * @param table 业务表信息
     */
    public void setPKColumn(TableGenBo table) {
        for (TableColumn column : table.getColumns()) {
            if (column.isPk()) {
                table.setPkColumn(column);
                break;
            }
        }
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> importTable(ImportDto dto) {
        List<String> tables = dto.getTables();
        Long dataSourceId = dto.getDataSourceId();
        Set<String> tableNameSet = tableMapper.selectTableNameByDataSourceId(dataSourceId);
        List<String> tableList = new ArrayList<>();
        List<String> exist = new ArrayList<>();
        for (String table : tables) {
            if (!tableNameSet.contains(table)) {
                tableList.add(table);
            } else {
                exist.add(table);
            }
        }
        if (tableList.isEmpty()) {
            return Result.error("需要新增的表在数据库中已存在!");
        }
        List<TableDto> tableDtoList = dynamicTableMetadataService.searchFullTableByTableNames(tables, dataSourceId);
        if (tableDtoList.isEmpty()) {
            return Result.error("当前表信息在数据库中已经不存在!");
        }
        OptionInfo defaultOption = OptionInfo.getDefaultInstance();
        String optionApi = JSON.toJSONString(defaultOption);
        Date now = new Date();
        tableDtoList.forEach(table -> {
            table.setOptionApi(optionApi);
            table.setCreateTime(now);
            tableMapper.insertTable(table);
            List<TableColumn> columns = table.getColumns();
            columns.forEach(column -> {
                column.setTableId(table.getTableId());
                column.setCreateTime(now);
//                tableColumnMapper.insert(column);
            });
            tableColumnMapper.batchInsert(columns);
        });
        if (!exist.isEmpty()) {
            StringBuilder sb = new StringBuilder();
            exist.forEach(str -> sb.append(str).append(","));
            return Result.ok(1001, "表:" + sb + "在数据库中已存在!", null);
        }
        return Result.ok();
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> edit(TableDto table) {
        table.setOptionApi(JSON.toJSONString(table.getOptionInfo()));
        tableMapper.updateTable(table);
        List<TableColumn> columns = table.getColumns();
        tableColumnMapper.batchUpdate(columns);
        return Result.ok();
    }


    @Override
    public void syncTable(Long tableId) {
        TableDto tableDto = tableMapper.selectTableDtoByTableId(tableId);
        if (null == tableDto){
            throw new CustomException("操作失败!");
        }
        List<TableDto> tableDtos = dynamicTableMetadataService.searchFullTableByTableNames(Collections.singletonList(tableDto.getTableName()), tableDto.getDataSourceId());
        if (null == tableDtos || tableDtos.size() != 1){
            throw new CustomException("同步数据失败，原表结构不存在");
        }
        List<TableColumn> dataBaseColumns = tableDto.getColumns();
        if (dataBaseColumns == null || dataBaseColumns.isEmpty()) {
            throw new CustomException("列信息查询为空!");
        }
        TableDto table = tableDtos.get(0);
        if (ObjectUtils.isEmpty(tableDto.getTableComment())){
            tableDto.setTableComment(table.getTableComment());
            tableMapper.updateTable(tableDto);
        }
        List<TableColumn> sourceColumn = table.getColumns();
        if (sourceColumn == null || sourceColumn.isEmpty()){
            tableColumnMapper.deleteByTableId(tableId);
            return;
        }
        Map<String, TableColumn> dataBaseColumnMap = dataBaseColumns.stream().collect(Collectors.toMap(TableColumn::getColumnName, Function.identity()));
        Map<String, TableColumn> sourceColumnMap = sourceColumn.stream().collect(Collectors.toMap(TableColumn::getColumnName, Function.identity()));
        Set<String> dataBaseSet = dataBaseColumnMap.keySet();
        List<TableColumn> updateList = new ArrayList<>();
        List<TableColumn> insertList = new ArrayList<>();
        List<Long> removeIds = new ArrayList<>();
        sourceColumnMap.forEach((key, sourceColumnColumn) -> {
            if (dataBaseColumnMap.containsKey(key)) {
                TableColumn dataBaseColumn = dataBaseColumnMap.get(key);
                boolean flag = false;
                if (!dataBaseColumn.getColumnType().equals(sourceColumnColumn.getColumnType())) {
                    dataBaseColumn.setColumnType(sourceColumnColumn.getColumnType());
                    flag = true;
                }
                if (ObjectUtils.isEmpty(dataBaseColumn.getColumnComment()) && !ObjectUtils.isEmpty(sourceColumnColumn.getColumnComment())) {
                    dataBaseColumn.setColumnComment(sourceColumnColumn.getColumnComment());
                    flag = true;
                }
                if (flag) {
                    updateList.add(dataBaseColumn);
                }
                dataBaseSet.remove(key);
            } else {
                sourceColumnColumn.setTableId(tableId);
                insertList.add(sourceColumnColumn);
            }
        });
        if (!dataBaseSet.isEmpty()) {
            dataBaseSet.forEach(key -> removeIds.add(dataBaseColumnMap.get(key).getColumnId()));
        }
        if (!updateList.isEmpty()) {
            tableColumnMapper.batchUpdate(updateList);
        }
        if (!insertList.isEmpty()) {
            tableColumnMapper.batchInsert(insertList);
        }
        if (!removeIds.isEmpty()) {
            tableColumnMapper.batchRemove(removeIds);
        }
    }

    @Override
    public void remove(Long tableId) {
        tableMapper.deleteTableById(tableId);
        tableColumnMapper.deleteByTableId(tableId);
    }


    @Override
    public void removeBatch(List<Long> tableIds) {


    }


    private void downloadZip(ByteArrayOutputStream outputStream) {
        HttpServletResponse response = HttpServletUtils.getResponse();
        response.setCharacterEncoding("utf-8");
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
        response.setContentType("application/octet-stream; charset=UTF-8");
        response.setHeader("Content-Disposition",
                "attachment;fileName=ebts-code.zip");
        try {
            IOUtils.write(outputStream.toByteArray(), response.getOutputStream());
        } catch (IOException e) {
            log.error("代码生成失败", e);
            throw new CustomException("word导出失败");
        }
    }
}
