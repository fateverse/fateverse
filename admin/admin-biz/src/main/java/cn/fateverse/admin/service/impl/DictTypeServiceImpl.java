package cn.fateverse.admin.service.impl;

import cn.fateverse.admin.query.DictTypeQuery;
import cn.fateverse.admin.entity.DictData;
import cn.fateverse.admin.entity.DictType;
import cn.fateverse.admin.mapper.DictDataMapper;
import cn.fateverse.admin.mapper.DictTypeMapper;
import cn.fateverse.admin.service.DictTypeService;
import cn.fateverse.admin.service.DictCacheService;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.enums.StateEnum;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.utils.LongUtils;
import cn.fateverse.common.core.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author Clay
 * @date 2022/11/9
 */
@Slf4j
@Service
public class DictTypeServiceImpl implements DictTypeService {


    private final DictTypeMapper dictTypeMapper;

    private final DictCacheService dictCacheService;

    private final DictDataMapper dictDataMapper;

    private final ThreadPoolTaskExecutor executor;


    public DictTypeServiceImpl(DictTypeMapper dictTypeMapper,
                               DictCacheService dictCacheService,
                               DictDataMapper dictDataMapper, ThreadPoolTaskExecutor executor) {
        this.dictTypeMapper = dictTypeMapper;
        this.dictCacheService = dictCacheService;
        this.dictDataMapper = dictDataMapper;
        this.executor = executor;
    }

    @PostConstruct
    private void init() {
        executor.execute(this::loadingDictCache);
    }

    @Override
    public void loadingDictCache() {
        Map<String, List<DictData>> dictDataMap = dictDataMapper.selectCacheList().stream().collect(Collectors.groupingBy(DictData::getDictType));
        dictDataMap.forEach(dictCacheService::setInit);
    }

    @Override
    public void clearDictCache() {
        dictCacheService.clear();
    }

    @Override
    public void resetDictCache() {
        dictCacheService.clear();
        loadingDictCache();
    }

    @Override
    public List<DictType> searchList(DictTypeQuery query) {
        return dictTypeMapper.selectList(query);
    }

    @Override
    public List<Option> searchOption() {
        DictTypeQuery query = new DictTypeQuery();
        query.setState(StateEnum.NORMAL.getCode());
        List<DictType> dictTypeList = dictTypeMapper.selectList(query);
        return dictTypeList.stream().map(dictType ->
                Option.builder()
                        .value(dictType.getDictType())
                        .label(dictType.getDictName())
                        .build()
                ).collect(Collectors.toList());
    }

    @Override
    public DictType searchById(Long dictId) {
        return dictTypeMapper.selectByDictId(dictId);
    }

    @Override
    public boolean checkUnique(DictType dictType) {
        Long dictId = LongUtils.isNull(dictType.getDictId()) ? -1L : dictType.getDictId();
        DictType info = dictTypeMapper.selectByDictType(dictType.getDictType());
        return checkDictType(info, dictId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void save(DictType dictType) {
        checkDictType(dictType);
        dictTypeMapper.insert(dictType);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void edit(DictType dictType) {
        checkDictType(dictType);
        DictType old = dictTypeMapper.selectByDictId(dictType.getDictId());
        if (null == old) {
            log.info("字典类型 id :{} 不存在!", dictType.getDictId());
            throw new CustomException("字典类型不存在,操作失败!");
        }
        dictCacheService.remove(old.getDictType());
        if (!old.getDictType().equals(dictType.getDictType())) {
            dictDataMapper.updateByDictType(old.getDictType(), dictType.getDictType());
        }
        dictTypeMapper.update(dictType);
        dictCacheService.asyncRemove(old.getDictType());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeById(Long dictId) {
        DictType dictType = searchById(dictId);
        if (null == dictType) {
            log.info("字典类型 id :{} 不存在!", dictId);
            throw new CustomException("系统异常!");
        }
        if (dictDataMapper.selectCountByType(dictType.getDictType()) > 0) {
            throw new CustomException(dictType.getDictName() + "已经分配,如果需要删除,请清除对应的数据!");
        }
        dictCacheService.remove(dictType.getDictType());
        dictTypeMapper.deleteById(dictId);
        dictCacheService.asyncRemove(dictType.getDictType());
    }


    private boolean checkDictType(DictType info, Long dictId) {
        return (!ObjectUtils.isEmpty(info) && !info.getDictId().equals(dictId));
    }

    private void checkDictType(DictType dictType){
        if (checkUnique(dictType)){
            throw new CustomException("当前字典类型:"+dictType.getDictType()+"已存在!");
        }
    }

}
