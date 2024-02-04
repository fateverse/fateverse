package cn.fateverse.code.service;

import cn.fateverse.code.entity.query.DynamicTable;
import cn.fateverse.code.entity.dto.TableDto;
import cn.fateverse.common.core.result.page.TableDataInfo;
import org.springframework.stereotype.Service;

import java.util.List;


/**
 * 动态表格元数据服务接口
 *
 * @author Clay
 * @date 2022/11/17
 */
@Service
public interface DynamicTableMetadataService {

    /**
     * 查询动态的表格源信息列表
     *
     * @param table        动态表格
     * @param dataSourceId 数据源id
     * @return 表格数据
     */
    TableDataInfo<DynamicTable> searchList(DynamicTable table, Long dataSourceId);

    /**
     * 获取到完成的表元数据
     *
     * @param tables       表格名称数组
     * @param dataSourceId 数据源id
     * @return 表格信息
     */
    List<TableDto> searchFullTableByTableNames(List<String> tables, Long dataSourceId);

}
