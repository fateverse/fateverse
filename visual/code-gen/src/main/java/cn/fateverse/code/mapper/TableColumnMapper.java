package cn.fateverse.code.mapper;

import cn.fateverse.code.entity.TableColumn;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/18
 */
public interface TableColumnMapper {


    /**
     * 根据表格id查询列信息
     *
     * @param tableId 表格id
     * @return 查询结果
     */
    List<TableColumn> selectListByTableId(Long tableId);

    /**
     * 新增列信息
     *
     * @param tableColumn
     * @return
     */
    int insert(TableColumn tableColumn);


    /**
     * 批量新增
     *
     * @param columns 列信息
     * @return 执行结果
     */
    int batchInsert(List<TableColumn> columns);

    /**
     * 修改列信息
     *
     * @param tableColumn
     * @return
     */
    int update(TableColumn tableColumn);

    /**
     * 批量修改列信息
     *
     * @param columns 列信息
     * @return 执行结果
     */
    int batchUpdate(List<TableColumn> columns);

    /**
     * 批量删除列信息
     *
     * @param tableIds
     * @return
     */
    int deleteByTableIds(List<Long> tableIds);

    /**
     * 删除列信息
     *
     * @param tableId
     * @return
     */
    int deleteByTableId(Long tableId);

    /**
     * 批量删除列信息
     *
     * @param ids 需要删除的id信息
     * @return 执行结果
     */
    int batchRemove(@Param("ids") List<Long> ids);
}
