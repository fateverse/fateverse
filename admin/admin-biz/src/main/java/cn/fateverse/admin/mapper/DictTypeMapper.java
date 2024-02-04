package cn.fateverse.admin.mapper;

import cn.fateverse.admin.query.DictTypeQuery;
import cn.fateverse.admin.entity.DictType;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/9
 */
public interface DictTypeMapper {

    /**
     * 查询字典类型列表
     *
     * @param query
     * @return
     */
    List<DictType> selectList(DictTypeQuery query);

    /**
     * 通过字典类型id查询字典信息
     *
     * @param dictId
     * @return
     */
    DictType selectByDictId(Long dictId);

    /**
     * 根据dictType查询字典类型
     * @param dictType
     * @return
     */
    DictType selectByDictType(String dictType);

    /**
     * 新增字典类型
     *
     * @param dictType
     * @return
     */
    int insert(DictType dictType);


    /**
     * 修改字典类型
     *
     * @param dictType
     * @return
     */
    int update(DictType dictType);

    /**
     * 删除字典信息
     *
     * @param dictId
     * @return
     */
    int deleteById(Long dictId);


}
