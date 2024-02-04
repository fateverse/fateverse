package cn.fateverse.common.excel.service;

import cn.fateverse.admin.dubbo.DubboDictDataService;
import cn.fateverse.admin.vo.DictDataVo;
import org.apache.dubbo.config.annotation.DubboReference;

import java.util.List;
import java.util.Map;

/**
 * @author Clay
 * @date 2023-02-20
 */
public class ExcelService {

    @DubboReference
    private DubboDictDataService dictDataService;

    public DubboDictDataService getDictDataService() {
        return dictDataService;
    }

    public Map<String, Map<String, DictDataVo>> searchDictDataCacheKeys(List<String> cacheKeys){
        return dictDataService.searchDictDataCacheKeys(cacheKeys);
    }


}
