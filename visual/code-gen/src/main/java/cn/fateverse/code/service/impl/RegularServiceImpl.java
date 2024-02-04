package cn.fateverse.code.service.impl;

import cn.fateverse.code.entity.Regular;
import cn.fateverse.code.entity.dto.RegularDto;
import cn.fateverse.code.entity.vo.RegularVo;
import cn.fateverse.code.entity.query.RegularQuery;
import cn.fateverse.code.mapper.RegularMapper;
import cn.fateverse.code.service.RegularService;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.security.utils.SecurityUtils;
import cn.fateverse.common.mybatis.utils.PageUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 校验规则表 Controller
 *
 * @author clay
 * @date 2023-05-27
 */
@Slf4j
@Service
public class RegularServiceImpl implements RegularService {

    private final RegularMapper regularMapper;

    public RegularServiceImpl(RegularMapper regularMapper) {
        this.regularMapper = regularMapper;
    }

    @Override
    public RegularVo searchById(Long id){
        Regular regular = regularMapper.selectById(id);
        return RegularVo.toRegulaVo(regular);
    }

    @Override
    public TableDataInfo<RegularVo> searchList(RegularQuery query){
        PageUtils.startPage();
        List<Regular> list = regularMapper.selectList(query);
        return PageUtils.convertDataTable(list, RegularVo::toRegulaVo);
    }

    @Override
    public List<Option> searchOptionList() {
        RegularQuery query = new RegularQuery();
        query.setEnable(1);
        List<Regular> list = regularMapper.selectList(query);
        return list.stream().map(regular->Option.builder()
                .value(regular.getId())
                .label(regular.getName())
                .build()).collect(Collectors.toList());
    }

    @Override
    public List<RegularVo> exportList(RegularQuery query){
        List<Regular> list = regularMapper.selectList(query);
        return list.stream().map(RegularVo::toRegulaVo)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = Exception.class,propagation = Propagation.REQUIRED)
    public int save(RegularDto regular){
        Regular info = regular.toRegula();
        info.setCreateBy(SecurityUtils.getUsername());
        return regularMapper.insert(info);
    }

    @Override
    @Transactional(rollbackFor = Exception.class,propagation = Propagation.REQUIRED)
    public int edit(RegularDto regular){
        Regular info = regular.toRegula();
        info.setUpdateBy(SecurityUtils.getUsername());
        return regularMapper.update(info);
    }

    @Override
    @Transactional(rollbackFor = Exception.class,propagation = Propagation.REQUIRED)
    public int removeById(Long id){
        return regularMapper.deleteById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class,propagation = Propagation.REQUIRED)
    public int removeBatch(List<Long> idList){
        return regularMapper.deleteBatchByIdList(idList);
    }

}
