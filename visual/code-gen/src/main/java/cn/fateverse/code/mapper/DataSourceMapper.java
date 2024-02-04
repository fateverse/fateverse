package cn.fateverse.code.mapper;

import cn.fateverse.code.entity.CodeDataSource;
import cn.fateverse.code.entity.query.DataSourceQuery;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/16
 */
public interface DataSourceMapper {

    /**
     * 查询数据源列表
     *
     * @param query 查询对象
     * @return 返回结果
     */
    List<CodeDataSource> selectList(DataSourceQuery query);

    /**
     * 根据id查询数据源信息
     *
     * @param dsId
     * @return
     */
    CodeDataSource selectById(Long dsId);

    /**
     * 新增数据源
     *
     * @param codeDataSource
     * @return
     */
    int insert(CodeDataSource codeDataSource);

    /**
     * 更新数据源信息
     *
     * @param codeDataSource
     * @return
     */
    int update(CodeDataSource codeDataSource);


    /**
     * 根据id删除数据源信息
     *
     * @param id
     * @return
     */
    int delete(Long id);


}
