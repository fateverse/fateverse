package cn.fateverse.code.service.impl;

import cn.hutool.core.util.StrUtil;
import cn.fateverse.code.entity.CodeDataSource;
import cn.fateverse.code.entity.dto.DataSourceDto;
import cn.fateverse.code.entity.query.DataSourceQuery;
import cn.fateverse.code.entity.vo.DataSourceVo;
import cn.fateverse.code.factory.DynamicDataSourceService;
import cn.fateverse.code.mapper.DataSourceMapper;
import cn.fateverse.code.service.DataSourceService;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.mybatis.utils.PageUtils;
import cn.fateverse.common.redis.annotation.RedisCache;
import cn.fateverse.common.redis.enums.RedisCacheType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author Clay
 * @date 2022/11/16
 */
@Slf4j
@Service
public class DataSourceServiceImpl implements DataSourceService {

    private final DataSourceMapper dataSourceMapper;

    private final DynamicDataSourceService dynamicDataSourceService;

    public DataSourceServiceImpl(DataSourceMapper dataSourceMapper,
                                 DynamicDataSourceService dynamicDataSourceService) {
        this.dataSourceMapper = dataSourceMapper;
        this.dynamicDataSourceService = dynamicDataSourceService;
    }


    @Override
    @RedisCache(prefix = "data-source")
    public TableDataInfo<DataSourceVo> searchList(DataSourceQuery query) {
        PageUtils.startPage();
        List<CodeDataSource> list = dataSourceMapper.selectList(query);
        return PageUtils.convertDataTable(list, DataSourceVo::toDataSourceVo);
    }

    @Override
    public List<DataSourceVo> searchExport(DataSourceQuery query) {
        List<CodeDataSource> list = dataSourceMapper.selectList(query);
        return list.stream().map(DataSourceVo::toDataSourceVo).collect(Collectors.toList());
    }

    @Override
    @RedisCache(prefix = "data-source",type = RedisCacheType.GET_BY_PRIMARY_KEY,primaryKey = "#{#id}")
    public CodeDataSource searchById(Long id) {
        return dataSourceMapper.selectById(id);
    }

    @Override
    @RedisCache(prefix = "data-source")
    public List<Option> searchOption() {
        List<CodeDataSource> codeDataSources = dataSourceMapper.selectList(new DataSourceQuery());
        return codeDataSources.stream().map(dataSource ->
                Option.builder()
                        .label(dataSource.getDsName())
                        .value(dataSource.getDsId())
                        .build()
        ).collect(Collectors.toList());
    }

    @Override
    @RedisCache(prefix = "data-source", type = RedisCacheType.INSERT)
    public void save(DataSourceDto dataSource) {
        CodeDataSource save = dataSource.toCodeDataSource();
        checkConnect(save);
        dataSourceMapper.insert(save);

    }

    @Override
    @RedisCache(prefix = "data-source", type = RedisCacheType.UPDATE, primaryKey = "#{#dataSource.dsId}")
    public void edit(DataSourceDto dataSource) {
        CodeDataSource edit = dataSource.toCodeDataSource();
        if (StrUtil.isBlank(dataSource.getPassword())){
            CodeDataSource codeDataSource = dataSourceMapper.selectById(dataSource.getDsId());
            edit.setPassword(codeDataSource.getPassword());
        }
        checkConnect(edit);
        dataSourceMapper.update(edit);
    }

    @Override
    @RedisCache(prefix = "data-source", type = RedisCacheType.DELETE, primaryKey = "#{#id}")
    public void removeById(Long id) {
        dataSourceMapper.delete(id);
    }

    /**
     * 检查数据源的连接性
     * @param dataSource 数据源
     */
    private void checkConnect(CodeDataSource dataSource){
        if (!dynamicDataSourceService.checkDataSource(dataSource)){
            throw new CustomException("数据源无法连接,请检查配置信息!");
        }
    }

}
