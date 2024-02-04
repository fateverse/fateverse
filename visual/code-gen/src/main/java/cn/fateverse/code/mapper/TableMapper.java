package cn.fateverse.code.mapper;

import cn.fateverse.code.entity.Table;
import cn.fateverse.code.entity.dto.TableDto;
import cn.fateverse.code.entity.query.TableQuery;

import java.util.List;
import java.util.Set;

/**
 * @author Clay
 * @date 2022/11/15
 */
public interface TableMapper {
    /**
     * 根据数据源id查询表格名称
     *
     * @param dataSourceId
     * @return
     */
    Set<String> selectTableNameByDataSourceId(Long dataSourceId);

    /**
     * 查询表格list
     *
     * @param query
     * @return 业务集合
     */
    List<Table> selectTableList(TableQuery query);

    /**
     * 查询所有表信息
     *
     * @return 表信息集合
     */
    List<Table> selectTableAll();

    /**
     * 根据id查询表信息
     *
     * @param id
     * @return
     */
    TableDto selectTableDtoByTableId(Long id);

    /**
     * 根据表名称查询表信息
     *
     * @param tableName
     * @return
     */
    TableDto selectTableByName(String tableName);

    /**
     * 新增
     *
     * @param table
     * @return
     */
    int insertTable(Table table);

    /**
     * 修改
     *
     * @param table
     * @return
     */
    int updateTable(Table table);

    /**
     * 删除
     *
     * @param tableId
     * @return
     */
    int deleteTableById(Long tableId);

    /**
     * 批量删除
     * @param ids
     * @return
     */
    int deleteTableByIds(Long[] ids);

}
