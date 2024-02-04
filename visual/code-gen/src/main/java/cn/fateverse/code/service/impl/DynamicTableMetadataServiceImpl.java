package cn.fateverse.code.service.impl;

import cn.fateverse.code.entity.CodeDataSource;
import cn.fateverse.code.entity.DynamicPage;
import cn.fateverse.code.entity.Table;
import cn.fateverse.code.entity.TableColumn;
import cn.fateverse.code.entity.query.DynamicTable;
import cn.fateverse.code.entity.dto.TableDto;
import cn.fateverse.code.mapper.dynamic.DynamicTableMapper;
import cn.fateverse.code.mapper.TableMapper;
import cn.fateverse.code.service.DynamicTableMetadataService;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.mybatis.utils.PageUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 动态表格元数据服务实现类
 *
 * @author Clay
 * @date 2022/11/17
 */
@Service
public class DynamicTableMetadataServiceImpl implements DynamicTableMetadataService {

    private final TableMapper tableMapper;

    private DynamicTableMapper dynamicTableMapper;

    private CodeDataSource dataSource;

    public DynamicTableMetadataServiceImpl(TableMapper tableMapper) {
        this.tableMapper = tableMapper;
    }

    @Override
    public TableDataInfo<DynamicTable> searchList(DynamicTable table, Long dataSourceId) {
        DynamicPage page = dataSource.getType().getDynamicDataSourceFactory().getDynamicPage();
        List<String> tableNameList = new ArrayList<>(tableMapper.selectTableNameByDataSourceId(dataSourceId));
        List<DynamicTable> dynamicTables = dynamicTableMapper.selectList(table, page, tableNameList);
        Long count = dynamicTableMapper.selectListCount(table, tableNameList);
        return PageUtils.convertDataTable(dynamicTables, count);
    }

    @Override
    public List<TableDto> searchFullTableByTableNames(List<String> tables, Long dataSourceId) {
        List<Table> tableList = dynamicTableMapper.selectListByNameList(tables);
        Map<String, List<TableColumn>> tableColumnListMap = dynamicTableMapper.selectColumnsByNameList(tables).stream().collect(Collectors.groupingBy(TableColumn::getDictType));
        return tableList.stream().map(table -> {
            table.setDataSourceId(dataSourceId);
            List<TableColumn> tableColumns = tableColumnListMap.get(table.getTableName());
            return dataSource.getType().getDynamicDataSourceFactory().initTable(table, tableColumns);
        }).collect(Collectors.toList());
    }

}
