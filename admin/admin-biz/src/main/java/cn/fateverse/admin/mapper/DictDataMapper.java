package cn.fateverse.admin.mapper;

import cn.fateverse.admin.query.DictDataQuery;
import cn.fateverse.admin.entity.DictData;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/9
 */
public interface DictDataMapper {
    /**
     * 查询字典信息
     *
     * @param query
     * @return
     */
    List<DictData> selectList(DictDataQuery query);

    /**
     * 根据字典类型查询数据
     *
     * @param dictType
     * @return
     */
    List<DictData> selectByType(String dictType);

    /**
     * 查询字典数据需要缓存的列表
     *
     * @return
     */
    List<DictData> selectCacheList();

    /**
     * 根据code查询字典数据
     *
     * @param dictCode
     * @return
     */
    DictData selectByCode(Long dictCode);

    /**
     * 通过类型查询下方的数据量
     *
     * @param dictType
     * @return
     */
    int selectCountByType(String dictType);

    /**
     * 新增字典数据
     *
     * @param dictData
     * @return
     */
    int insert(DictData dictData);

    /**
     * 修改字典数据
     *
     * @param dictData
     * @return
     */
    int update(DictData dictData);

    /**
     * 删除字典数据
     *
     * @param dictCode
     * @return
     */
    int deleteByCode(Long dictCode);

    /**
     * 批量删除字典数据
     * @param dictCodeList
     * @return
     */
    int deleteBatch(List<Long> dictCodeList);

    /**
     * 更新DictData的dictType
     *
     * @param dictType
     * @param newDictType
     * @return
     */
    int updateByDictType(@Param("dictType") String dictType, @Param("newDictType") String newDictType);

}
