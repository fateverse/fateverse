package cn.fateverse.admin.dubbo;

import cn.fateverse.admin.vo.DictDataVo;

import java.util.List;
import java.util.Map;

/**
 * @author Clay
 * @date 2023-02-20
 */

public interface DubboDictDataService {

    /**
     * 获取到字典缓存
     *
     * @param cacheKeys 字典缓存key
     * @return 映射完成的字典对象
     */
    Map<String, Map<String, DictDataVo>> searchDictDataCacheKeys(List<String> cacheKeys);

}
