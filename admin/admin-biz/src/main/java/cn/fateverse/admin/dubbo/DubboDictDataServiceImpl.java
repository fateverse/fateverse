package cn.fateverse.admin.dubbo;

import cn.fateverse.admin.service.DictDataService;
import cn.fateverse.admin.vo.DictDataVo;
import org.apache.dubbo.config.annotation.DubboService;

import java.util.List;
import java.util.Map;

/**
 * @author Clay
 * @date 2023-02-20
 */
@DubboService
public class DubboDictDataServiceImpl implements DubboDictDataService {

    private final DictDataService dictDataService;

    public DubboDictDataServiceImpl(DictDataService dictDataService) {
        this.dictDataService = dictDataService;
    }

    @Override
    public Map<String, Map<String, DictDataVo>> searchDictDataCacheKeys(List<String> cacheKeys) {
        return dictDataService.searchCacheKeys(cacheKeys);
    }
}
