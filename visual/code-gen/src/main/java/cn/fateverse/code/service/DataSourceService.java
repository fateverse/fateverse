package cn.fateverse.code.service;

import cn.fateverse.code.entity.CodeDataSource;
import cn.fateverse.code.entity.dto.DataSourceDto;
import cn.fateverse.code.entity.query.DataSourceQuery;
import cn.fateverse.code.entity.vo.DataSourceVo;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.result.page.TableDataInfo;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/16
 */
public interface DataSourceService {


    /**
     * 查询数据源列表
     *
     * @param query 查询对象
     * @return 查询结果
     */
    TableDataInfo<DataSourceVo> searchList(DataSourceQuery query);


    /**
     * 导出数据
     * @param query 查询对象
     * @return 查询结果
     */
    List<DataSourceVo> searchExport(DataSourceQuery query);

    /**
     * 根据id获取数据源
     *
     * @param id
     * @return
     */
    CodeDataSource searchById(Long id);

    /**
     * 获取到option类型的数据源信息
     *
     * @return
     */
    List<Option> searchOption();

    /**
     * 新增数据源
     *
     *
     * @param dataSource 数据源信息
     */
    void save(DataSourceDto dataSource);

    /**
     * 更新数据源
     *
     * @param dataSource 数据源信息
     */
    void edit(DataSourceDto dataSource);

    /**
     * 根据id删除数据源
     *
     * @param id
     */
    void removeById(Long id);
}
