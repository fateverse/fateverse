package cn.fateverse.code.mapper.dynamic;

import cn.fateverse.code.entity.DynamicPage;
import cn.fateverse.code.entity.TableColumn;
import cn.fateverse.code.entity.query.DynamicTable;
import cn.fateverse.code.entity.Table;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/17
 */
public interface DynamicTableMapper {

    /**
     * 检查数据源是否可用
     * @return
     */
    Integer checkSource();


    /**
     * 查询动态的表格源信息列表
     *
     * @param table
     * @param page
     * @param tableName
     * @return
     */
    List<DynamicTable> selectList(@Param("table") DynamicTable table, @Param("page") DynamicPage page, @Param("list") List<String> tableName);

    /**
     * 查询动态的表格源信息 总数
     * @param table
     * @param tableName
     * @return
     */
    Long selectListCount(@Param("table") DynamicTable table, @Param("list") List<String> tableName);

    /**
     * 通过表名称查询
     *
     * @param tables
     * @return
     */
    List<Table> selectListByNameList(List<String> tables);

    /**
     * 根据tablename list 获取到所有的
     *
     * @param tables
     * @return
     */
    List<TableColumn> selectColumnsByNameList(List<String> tables);
}
