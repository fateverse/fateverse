package cn.fateverse.admin.service.impl;

import cn.fateverse.admin.entity.dto.MappingSwitchDto;
import cn.fateverse.admin.entity.vo.MappingSwitchVo;
import cn.fateverse.admin.query.MappingSwitchQuery;
import cn.fateverse.admin.service.MappingSwitchService;
import cn.fateverse.common.core.entity.PageInfo;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.TableSupport;
import cn.fateverse.common.mybatis.utils.PageUtils;
import cn.fateverse.common.security.entity.MappingSwitchInfo;
import cn.fateverse.common.security.utils.SecurityUtils;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import javax.annotation.Resource;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author Clay
 * @date 2024/2/5 14:21
 */
@Slf4j
@Service
public class MappingSwitchServiceImpl implements MappingSwitchService {


    @Resource
    private RedisTemplate<String, MappingSwitchInfo> redisTemplate;

    @Override
    public TableDataInfo<MappingSwitchVo> search(MappingSwitchQuery query) {
        String pattern = getPattern(query);
        PageInfo pageInfo = TableSupport.buildPageRequest();
        int start = (pageInfo.getPageNum() - 1) * pageInfo.getPageSize();
        int end = start + pageInfo.getPageSize();
        long total = 0L;
        Set<String> keys = new HashSet<>();
        try (Cursor<String> scanCursor = redisTemplate.scan(ScanOptions.scanOptions()
                .match(pattern).build())) {
            while (scanCursor.hasNext()) {
                String key = scanCursor.next();
                if (total >= start && total < end) {
                    keys.add(key);
                }
                total++;
            }
        }
        List<MappingSwitchInfo> switchInfoList = redisTemplate.opsForValue().multiGet(keys);
        if (switchInfoList == null || switchInfoList.isEmpty()) {
            return PageUtils.getDataTable(new ArrayList<>());
        }
        List<MappingSwitchVo> result = switchInfoList.stream().map(MappingSwitchVo::toMappingSwitchVo).collect(Collectors.toList());
        return PageUtils.convertDataTable(result, total);
    }

    @NotNull
    private String getPattern(MappingSwitchQuery query) {
        String mappingSwitchKey = MappingSwitchInfo.MappingSwitchConstant.MAPPING_SWITCH;
        String applicationNameKey = "";
        if (!ObjectUtils.isEmpty(query.getApplicationName())) {
            applicationNameKey = "*" + query.getApplicationName() + "*";
        } else {
            applicationNameKey = "*";
        }
        String classNameKey = "";
        if (!ObjectUtils.isEmpty(query.getClassName())) {
            classNameKey = ":*" + query.getClassName() + "*";
        } else {
            classNameKey = "";
        }
        String methodNameKey = "";
        if (!ObjectUtils.isEmpty(query.getMethodName())) {
            methodNameKey = ":*" + query.getMethodName() + "*";
        } else {
            methodNameKey = "";
        }
        if (!ObjectUtils.isEmpty(methodNameKey) && ObjectUtils.isEmpty(classNameKey)) {
            classNameKey = ":*";
        }
        return mappingSwitchKey + applicationNameKey + classNameKey + methodNameKey;
    }


    @Override
    public void update(MappingSwitchDto dto) {
        MappingSwitchInfo mappingSwitchInfo = redisTemplate.opsForValue().get(dto.getKey());
        if (mappingSwitchInfo == null) {
            throw new CustomException("无当前数据信息");
        }
        if (mappingSwitchInfo.getState() != dto.getState()) {
            mappingSwitchInfo.setState(dto.getState());
            mappingSwitchInfo.setOperName(SecurityUtils.getUsername());
            mappingSwitchInfo.setOperTime(new Date());

            redisTemplate.opsForValue().set(mappingSwitchInfo.getKey(), mappingSwitchInfo);
        }
    }
}
