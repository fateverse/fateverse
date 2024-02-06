package cn.fateverse.admin.service;

import cn.fateverse.admin.dto.MappingSwitchDto;
import cn.fateverse.admin.entity.vo.MappingSwitchVo;
import cn.fateverse.admin.query.MappingSwitchQuery;
import cn.fateverse.common.core.result.page.TableDataInfo;

/**
 * @author Clay
 * @date 2024/2/5 14:21
 */
public interface MappingSwitchService {

    /**
     * 查询列表信息
     *
     * @param query 查询对象
     * @return 查询结果
     */
    TableDataInfo<MappingSwitchVo> search(MappingSwitchQuery query);

    /**
     * 更新状态
     *
     * @param dto 更新对象
     */
    void update(MappingSwitchDto dto);
}
