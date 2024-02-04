package cn.fateverse.code.service;

import cn.fateverse.code.entity.dto.RegularDto;
import cn.fateverse.code.entity.vo.RegularVo;
import cn.fateverse.code.entity.query.RegularQuery;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.result.page.TableDataInfo;

import java.util.List;

/**
 * 校验规则表 Service
 *
 * @author clay
 * @date 2023-05-27
 */
public interface RegularService {

    /**
     * 查询校验规则表
     *
     * @param id 校验规则表Id
     * @return 校验规则表
     */
    RegularVo searchById(Long id);

    /**
     * 查询校验规则表列表
     *
     * @param query 校验规则表
     * @return 校验规则表集合
     */
    TableDataInfo<RegularVo> searchList(RegularQuery query);

    /**
     * 获取到选项列表
     *
     * @return 选项列表
     */
    List<Option> searchOptionList();

    /**
     * 导出校验规则表列表
     *
     * @param query query 校验规则表
     * @return 校验规则表集合
     */
    List<RegularVo> exportList(RegularQuery query);

    /**
     * 新增校验规则表
     *
     * @param regular 校验规则表
     * @return 结果
     */
    int save(RegularDto regular);

    /**
     * 修改校验规则表
     *
     * @param regular 校验规则表
     * @return 结果
     */
    int edit(RegularDto regular);

    /**
     * 删除校验规则表
     *
     * @param id 需要删除的校验规则表Id
     * @return 结果
     */
    int removeById(Long id);

    /**
     * 批量删除校验规则表
     *
     * @param idList 需要删除的校验规则表Id 集合
     * @return 结果
     */
    int removeBatch(List<Long> idList);
}
