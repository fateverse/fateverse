package cn.fateverse.code.mapper;

import cn.fateverse.code.entity.Regular;
import cn.fateverse.code.entity.query.RegularQuery;

import java.util.List;

/**
 * 校验规则表 Mapper
 *
 * @author clay
 * @date 2023-05-27
 */
public interface RegularMapper {

    /**
     * 查询校验规则表
     *
     * @param id 校验规则表Id
     * @return 校验规则表
     */
    Regular selectById(Long id);

    /**
     * 查询校验规则表列表
     *
     * @param query 校验规则表查询
     * @return 校验规则表集合
     */
    List<Regular> selectList(RegularQuery query);

    /**
     * 新增校验规则表
     *
     * @param regular 校验规则表
     * @return 结果
     */
    int insert(Regular regular);

    /**
     * 修改校验规则表
     *
     * @param regular 校验规则表
     * @return 结果
     */
    int update(Regular regular);

    /**
     * 删除校验规则表
     *
     * @param id 需要删除的校验规则表Id
     * @return 结果
     */
    int deleteById(Long id);

    /**
     * 批量删除校验规则表
     *
     * @param idList 需要删除的校验规则表Id 集合
     * @return 结果
     */
    int deleteBatchByIdList(List<Long> idList);

}
