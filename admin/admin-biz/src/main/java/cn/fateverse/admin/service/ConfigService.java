package cn.fateverse.admin.service;

import cn.fateverse.admin.dto.ConfigDto;
import cn.fateverse.admin.query.ConfigQuery;
import cn.fateverse.admin.vo.ConfigVo;
import cn.fateverse.common.core.result.page.TableDataInfo;

import java.util.List;

/**
 * 参数配置表 Service
 *
 * @author clay
 * @date 2023-06-09
 */
public interface ConfigService {

    /**
     * 查询参数配置表
     *
     * @param configId 参数配置表Id
     * @return 参数配置表
     */
    ConfigVo searchById(Integer configId);

    /**
     * 查询参数配置表列表
     *
     * @param query 参数配置表
     * @return 参数配置表集合
     */
    TableDataInfo<ConfigVo> searchList(ConfigQuery query);



    TableDataInfo<ConfigVo> searchListPage(ConfigQuery query);
    /**
     * 查询参数配置表option
     *
     * @return 选项集合
     */

    /**
    * 导出参数配置表列表
     *
     * @param query query 参数配置表
     * @return 参数配置表集合
    */
    List<ConfigVo> exportList(ConfigQuery query);

    /**
     * 新增参数配置表
     *
     * @param config 参数配置表
     * @return 结果
     */
    int save(ConfigDto config);

    /**
     * 修改参数配置表
     *
     * @param config 参数配置表
     * @return 结果
     */
    int edit(ConfigDto config);

    /**
     * 删除参数配置表
     *
     * @param configId 需要删除的参数配置表Id
     * @return 结果
     */
    int removeById(Integer configId);

    /**
     * 批量删除参数配置表
     *
     * @param configIdList 需要删除的参数配置表Id 集合
     * @return 结果
     */
    int removeBatch(List<Integer> configIdList);

}