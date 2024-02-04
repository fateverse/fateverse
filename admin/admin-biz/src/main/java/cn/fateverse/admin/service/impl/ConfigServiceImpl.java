package cn.fateverse.admin.service.impl;

import cn.fateverse.admin.dto.ConfigDto;
import cn.fateverse.admin.query.ConfigQuery;
import cn.fateverse.admin.vo.ConfigVo;
import cn.fateverse.admin.entity.Config;
import cn.fateverse.admin.mapper.ConfigMapper;
import cn.fateverse.admin.service.ConfigService;
import cn.fateverse.common.core.entity.PageInfo;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.ObjectUtils;
import cn.fateverse.common.core.utils.TableSupport;
import cn.fateverse.common.mybatis.utils.PageUtils;
import cn.fateverse.common.security.utils.SecurityUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 参数配置表 Controller
 *
 * @author clay
 * @date 2023-06-09
 */
@Slf4j
@Service
public class ConfigServiceImpl implements ConfigService {

    private final ConfigMapper configMapper;

    public ConfigServiceImpl(ConfigMapper configMapper) {
        this.configMapper = configMapper;
    }

    @Override
    public ConfigVo searchById(Integer configId) {
        Config config = configMapper.selectById(configId);
        return ConfigVo.toConfigVo(config);
    }

    @Override
    public TableDataInfo<ConfigVo> searchList(ConfigQuery query) {
        long startTime = System.currentTimeMillis();
        PageUtils.startPage();
        List<Config> list = configMapper.selectList(query);
        log.info("query time :{}", (System.currentTimeMillis() - startTime));
        return PageUtils.convertDataTable(list, ConfigVo::toConfigVo);
    }


    @Override
    public TableDataInfo<ConfigVo> searchListPage(ConfigQuery query) {
        long startTime = System.currentTimeMillis();
        PageInfo pageInfo = TableSupport.buildPageRequest();
        Integer start = (pageInfo.getPageNum() - 1) * pageInfo.getPageSize();
        List<Config> list = configMapper.selectListPage(query, start, pageInfo.getPageSize());
        List<ConfigVo> result = list.stream().filter(item -> !ObjectUtils.isEmpty(item)).map(ConfigVo::toConfigVo).collect(Collectors.toList());
        Long count = configMapper.selectCount(query);
        log.info("page query time :{}", (System.currentTimeMillis() - startTime));
        return PageUtils.convertDataTable(result, count);
    }

    @Override
    public List<ConfigVo> exportList(ConfigQuery query) {
        List<Config> list = configMapper.selectList(query);
        return list.stream().map(ConfigVo::toConfigVo)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int save(ConfigDto config) {
        Config info = config.toConfig();
        info.setCreateBy(SecurityUtils.getUsername());
        return configMapper.insert(info);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int edit(ConfigDto config) {
        Config info = config.toConfig();
        info.setUpdateBy(SecurityUtils.getUsername());
        return configMapper.update(info);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int removeById(Integer configId) {
        return configMapper.deleteById(configId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int removeBatch(List<Integer> configIdList) {
        return configMapper.deleteBatchByIdList(configIdList);
    }

}