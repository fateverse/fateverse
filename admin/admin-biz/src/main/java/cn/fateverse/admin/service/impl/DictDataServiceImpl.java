package cn.fateverse.admin.service.impl;

import cn.fateverse.admin.dto.DictDataDto;
import cn.fateverse.admin.query.DictDataQuery;
import cn.fateverse.admin.vo.DictDataSimpVo;
import cn.fateverse.admin.vo.DictDataVo;
import cn.fateverse.admin.entity.DictData;
import cn.fateverse.admin.mapper.DictDataMapper;
import cn.fateverse.admin.service.DictCacheService;
import cn.fateverse.admin.service.DictDataService;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.mybatis.utils.PageUtils;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;
import java.util.stream.Collectors;

/**
 * @author Clay
 * @date 2022/11/9
 */
@Slf4j
@Service
public class DictDataServiceImpl implements DictDataService {

    private final DictDataMapper dictDataMapper;

    private final DictCacheService dictCacheService;

    private final RedissonClient redissonClient;

    public DictDataServiceImpl(DictDataMapper dictDataMapper,
                               DictCacheService dictCacheService, RedissonClient redissonClient) {
        this.dictDataMapper = dictDataMapper;
        this.dictCacheService = dictCacheService;
        this.redissonClient = redissonClient;
    }

    @Override
    public TableDataInfo<DictDataVo> searchList(DictDataQuery query) {
        PageUtils.startPage();
        List<DictData> list = dictDataMapper.selectList(query);
        return PageUtils.convertDataTable(list, DictData::toDictDataListVo);
    }

    @Override
    public DictDataVo searchByCode(Long dictCode) {
        DictData dictData = dictDataMapper.selectByCode(dictCode);
        return DictData.toDictDataVo(dictData);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void save(DictDataDto dto) {
        DictData dictData = DictData.toDictData(dto);
        deleteCache(dictData.getDictType());
        updateDictDataSupplier(dictData.getDictType(), () -> {
            dictDataMapper.insert(dictData);
            DictData dictDataDB = dictDataMapper.selectByCode(dictData.getDictCode());
            return dictDataDB != null;
        });
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void edit(DictDataDto dto) {
        DictData dictData = DictData.toDictData(dto);
        updateDictDataSupplier(dictData.getDictType(), () -> {
            dictDataMapper.update(dictData);
            return Boolean.TRUE;
        });
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeByCode(Long dictCode) {
        DictData dictData = dictDataMapper.selectByCode(dictCode);
        updateDictDataSupplier(dictData.getDictType(), () -> {
            dictDataMapper.deleteByCode(dictCode);
            DictData dictDataDB = dictDataMapper.selectByCode(dictCode);
            return dictDataDB == null;
        });
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeBatch(List<Long> dictCodeList) {
        DictData dictData = dictDataMapper.selectByCode(dictCodeList.get(0));
        updateDictDataSupplier(dictData.getDictType(), () -> {
            dictDataMapper.deleteBatch(dictCodeList);
            return Boolean.TRUE;
        });
    }

    /**
     * 更新字典信息
     *
     * @param dictType 字典类型
     * @param supplier 函数方法
     */
    private void updateDictDataSupplier(String dictType, Supplier<Boolean> supplier) {
        deleteCache(dictType);
        Boolean result = supplier.get();
        if (result) {
            asyncDeleteCache(dictType);
        }
    }

    @Override
    public List<Option> option(String dictType) {
        List<DictData> dictData = refreshCacheList(dictType);
        return dictData.stream()
                .map(DictData::dictDataToOption).collect(Collectors.toList());
    }

    @Override
    public Map<String, Map<String, DictDataVo>> searchCacheKeys(List<String> dictType) {
        Map<String, Map<String, DictDataVo>> mapData = new ConcurrentHashMap<>(8);
        dictType.forEach(key -> {
            List<DictData> dictData = refreshCacheList(key);
            mapData.put(key, dictData.stream().collect(Collectors.toMap(DictData::getDictValue, DictData::toDictDataListVo)));
        });
        return mapData;
    }

    @Override
    public Map<String, List<DictDataSimpVo>> get(List<String> dictType) {
        Map<String, List<DictDataSimpVo>> resultMap = new HashMap<>(dictType.size());
        dictType.forEach(cacheKey -> {
            List<DictDataSimpVo> list = refreshCacheList(cacheKey).stream()
                    .map(DictData::toDictDataSimpVo).collect(Collectors.toList());
            resultMap.put(cacheKey, list);
        });
        return resultMap;
    }

    /**
     * 双重检查锁机制去获取并刷新缓存数据
     *
     * @param cacheKey 缓存key
     * @return 字典数据
     */
    private List<DictData> refreshCacheList(String cacheKey) {
        List<DictData> dictCache = dictCacheService.get(cacheKey);
        if (null == dictCache) {
            RLock lock = redissonClient.getLock(dictCacheService.getCacheKey(cacheKey) + ":lock");
            try {
                if (lock.tryLock(2, TimeUnit.SECONDS)) {
                    dictCache = dictCacheService.get(cacheKey);
                    if (null == dictCache) {
                        dictCache = dictDataMapper.selectByType(cacheKey);
                        if (null == dictCache || dictCache.isEmpty()) {
                            dictCacheService.setTime(cacheKey, new ArrayList<>());
                        } else {
                            dictCacheService.set(cacheKey, dictCache);
                        }
                    }
                } else {
                    dictCache = new ArrayList<>();
                }
            } catch (InterruptedException e) {
                log.info("数据获取失败 {}", e.getMessage(), e);
                return new ArrayList<>();
            } finally {
                if (lock.isLocked() && lock.isHeldByCurrentThread()) {
                    lock.unlock();
                }
            }
        }
        return dictCache;
    }

    /**
     * 删除字典
     *
     * @param dictType 字典类型
     */
    private void deleteCache(String dictType) {
        dictCacheService.remove(dictType);
    }

    /**
     * 异步删除字典
     *
     * @param dictType 字典类型
     */
    private void asyncDeleteCache(String dictType) {
        dictCacheService.asyncRemove(dictType);
    }

}
