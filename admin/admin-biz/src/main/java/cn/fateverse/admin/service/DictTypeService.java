package cn.fateverse.admin.service;

import cn.fateverse.admin.query.DictTypeQuery;
import cn.fateverse.admin.entity.DictType;
import cn.fateverse.common.core.entity.Option;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/9
 */
public interface DictTypeService {


    /**
     * 记载字段缓存数据
     */
    void loadingDictCache();

    /**
     * 清除缓存记录
     */
    void clearDictCache();

    /**
     * 重置字典缓存数据
     */
    void resetDictCache();

    /**
     * 查询字典类型列表
     *
     * @param query 字典类型查询
     * @return 字典类型列表
     */
    List<DictType> searchList(DictTypeQuery query);

    /**
     * 获取到字典类型的option
     *
     * @return 选项列表
     */
    List<Option> searchOption();

    /**
     * 通过id查询字典类型信息
     *
     * @param dictId 字典类型id
     * @return 字典类型数据
     */
    DictType searchById(Long dictId);

    /**
     * 检查dictType是否唯一
     *
     * @param dictType 字典类型
     * @return 检查结果
     */
    boolean checkUnique(DictType dictType);

    /**
     * 新增字典类型
     *
     * @param dictType 字典类型
     */
    void save(DictType dictType);

    /**
     * 更新字典类型
     *
     * @param dictType 字典类型
     */
    void edit(DictType dictType);


    /**
     * 删除字典类型
     *
     * @param dictId 字典id
     */
    void removeById(Long dictId);


}
