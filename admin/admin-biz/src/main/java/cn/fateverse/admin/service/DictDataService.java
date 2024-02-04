package cn.fateverse.admin.service;

import cn.fateverse.admin.dto.DictDataDto;
import cn.fateverse.admin.query.DictDataQuery;
import cn.fateverse.admin.vo.DictDataSimpVo;
import cn.fateverse.admin.vo.DictDataVo;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.result.page.TableDataInfo;

import java.util.List;
import java.util.Map;

/**
 * @author Clay
 * @date 2022/11/9
 */
public interface DictDataService {

    /**
     * 查询字典信息
     *
     * @param query 查询对象
     * @return 表格信息数据
     */
    TableDataInfo<DictDataVo> searchList(DictDataQuery query);

    /**
     * 根据code查询字典数据
     *
     * @param dictCode 字典code
     * @return 字典数据信息
     */
    DictDataVo searchByCode(Long dictCode);

    /**
     * 新增字典数据
     *
     * @param dto 字典数据
     */
    void save(DictDataDto dto);

    /**
     * 修改字典数据
     *
     * @param dto 字典数据
     */
    void edit(DictDataDto dto);

    /**
     * 删除字典数据
     *
     * @param dictCode 字典数据code
     */
    void removeByCode(Long dictCode);

    /**
     * 批量删除字典数据
     *
     * @param dictCodeList 字典数据code list
     */
    void removeBatch(List<Long> dictCodeList);


    /**
     * 获取到option的字典数据
     *
     * @param cacheKey 字典缓存key
     * @return option选项列表
     */
    List<Option> option(String cacheKey);

    /**
     * 批量获取缓存字典
     *
     * @param cacheKeys 字典缓存列表
     * @return 映射完成后的字典对象
     */
    Map<String, Map<String, DictDataVo>> searchCacheKeys(List<String> cacheKeys);

    /**
     * 获取到完整的字典数据
     *
     * @param cacheKeys 字典缓存key
     * @return 字典数据简单返回对象
     */
    Map<String,List<DictDataSimpVo>> get(List<String> cacheKeys);


}
