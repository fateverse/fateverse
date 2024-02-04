package cn.fateverse.admin.mapper;

import cn.fateverse.admin.query.ConfigQuery;
import cn.fateverse.admin.entity.Config;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 参数配置表 Mapper
 *
 * @author clay
 * @date 2023-06-09
 */
public interface ConfigMapper {

    /**
     * 查询参数配置表
     *
     * @param configId 参数配置表Id
     * @return 参数配置表
     */
    Config selectById(Integer configId);

    /**
     * 查询参数配置表列表
     *
     * @param query 参数配置表查询
     * @return 参数配置表集合
     */
    List<Config> selectListPage(@Param("query") ConfigQuery query, @Param("start") Integer start, @Param("size") Integer size);


    Long selectCount(@Param("query") ConfigQuery query);

    List<Config> selectList(ConfigQuery query);

    /**
     * 新增参数配置表
     *
     * @param config 参数配置表
     * @return 结果
     */
    int insert(Config config);

    /**
     * 修改参数配置表
     *
     * @param config 参数配置表
     * @return 结果
     */
    int update(Config config);

    /**
     * 删除参数配置表
     *
     * @param configId 需要删除的参数配置表Id
     * @return 结果
     */
    int deleteById(Integer configId);

    /**
     * 批量删除参数配置表
     *
     * @param configIdList 需要删除的参数配置表Id 集合
     * @return 结果
     */
    int deleteBatchByIdList(List<Integer> configIdList);

}