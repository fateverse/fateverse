package cn.fateverse.admin.service.impl;

import cn.fateverse.admin.vo.DeptVo;
import cn.fateverse.admin.mapper.DeptMapper;
import cn.fateverse.admin.service.DeptService;
import cn.fateverse.common.core.constant.UserConstants;
import cn.fateverse.admin.entity.Dept;
import cn.fateverse.common.core.entity.OptionTree;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.utils.LongUtils;
import cn.fateverse.common.core.utils.ObjectUtils;
import cn.fateverse.common.core.utils.convert.TreeUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * @author Clay
 * @date 2022/11/2
 */
@Slf4j
@Service
public class DeptServiceImpl implements DeptService {


    private final DeptMapper deptMapper;

    public DeptServiceImpl(DeptMapper deptMapper) {
        this.deptMapper = deptMapper;
    }

    @Override
    public List<DeptVo> searchTree(String deptName, Integer state) {
        List<Dept> deptList = deptMapper.selectList(deptName, state);
        return TreeUtil.build(deptList, DeptVo.class, (config) -> {
            config.setIdField("deptId");
            config.setExclude("phone");
        });
    }

    @Override
    public DeptVo searchById(Long deptId) {
        Dept dept = deptMapper.selectById(deptId);
        DeptVo deptVo = new DeptVo();
        BeanUtils.copyProperties(dept, deptVo);
        return deptVo;
    }

    @Override
    public List<OptionTree> searchExcludeTree(Long deptId) {
        Dept dept = deptMapper.selectById(deptId);
        if (0L == dept.getParentId()) {
            return new ArrayList<>();
        }
        List<Dept> deptList = deptMapper.selectExclude(deptId);
        return TreeUtil.build(deptList, OptionTree.class, (config) -> {
            config.setIdField("deptId");
            config.setOption("deptId", "deptName");
        });
    }

    @Override
    public List<OptionTree> searchTreeOption() {
        List<Dept> deptList = deptMapper.selectList(null, null);
        return TreeUtil.build(deptList, OptionTree.class, (config) -> {
            config.setIdField("deptId");
            config.setOption("deptId", "deptName");
        });
    }

    @Override
    public List<DeptVo> searchByIds(List<Long> deptIds) {
        List<Dept> deptList = deptMapper.selectByIds(deptIds);
        return deptList.stream().map(dept ->
                DeptVo.builder()
                        .deptId(dept.getDeptId())
                        .parentId(dept.getParentId())
                        .deptName(dept.getDeptName())
                        .email(dept.getEmail())
                        .orderNum(dept.getOrderNum())
                        .leader(dept.getLeader())
                        .leaderId(dept.getLeaderId())
                        .phone(dept.getPhone())
                        .state(dept.getState())
                        .createTime(dept.getCreateTime())
                        .build()
        ).collect(Collectors.toList());
    }

    @Override
    public String checkNameUnique(Dept dept) {
        Long deptId = LongUtils.isNull(dept.getDeptId()) ? -1L : dept.getDeptId();
        Dept info = deptMapper.selectByDeptNameAndParentId(dept.getDeptName(), deptId);
        if (!ObjectUtils.isEmpty(info) && !info.getDeptId().equals(deptId)) {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }

    @Override
    public boolean hasChildById(Long deptId) {
        return deptMapper.selectChildCountByDeptId(deptId) > 0;
    }

    @Override
    public boolean checkExistUser(Long deptId) {
        return deptMapper.selectExistUserCount(deptId) > 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int save(Dept dept) {
        Set<String> deptNameSet = deptMapper.selectDeptNameListByParentId(dept.getParentId());
        Dept info = deptMapper.selectById(dept.getParentId());
        if (deptNameSet.contains(dept.getDeptName())) {
            throw new CustomException(info.getDeptName() + "下已经存在" + dept.getDeptName() + "部门");
        }
        if (UserConstants.DEPT_DISABLE.equals(info.getState())) {
            throw new CustomException("上级部门停用,不允许添加");
        }
        dept.setAncestors(info.getAncestors() + "," + info.getDeptId());
        return deptMapper.insert(dept);
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public int edit(Dept dept) {
        Dept newParentDept = deptMapper.selectById(dept.getParentId());
        Dept oldDept = deptMapper.selectById(dept.getDeptId());
        if (null != newParentDept && null != oldDept) {
            String newAncestors = newParentDept.getAncestors() + "," + newParentDept.getDeptId();
            String oldAncestors = oldDept.getAncestors();
            dept.setAncestors(newAncestors);
            updateDeptChildren(dept.getDeptId(), newAncestors, oldAncestors);
        }
        if (null != newParentDept && UserConstants.DEPT_DISABLE.equals(newParentDept.getState())) {
            updateParentDept(dept);
        }
        return deptMapper.update(dept);
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public int remove(Long deptId) {
        return deptMapper.delete(deptId);
    }

    /**
     * 更新父级部门的状态
     *
     * @param dept
     */
    public void updateParentDept(Dept dept) {
        dept = deptMapper.selectById(dept.getDeptId());
        deptMapper.updateState(dept);
    }

    /**
     * 更新字元素的ancestors
     *
     * @param deptId
     * @param newAncestors
     * @param odlAncestors
     */
    public void updateDeptChildren(Long deptId, String newAncestors, String odlAncestors) {
        List<Dept> children = deptMapper.selectChildrenById(deptId);
        List<Dept> newChildren = children.stream().peek(child -> {
            child.setAncestors(child.getAncestors().replace(odlAncestors, newAncestors));
        }).collect(Collectors.toList());
        if (newChildren.size() > 0) {
            deptMapper.updateChildren(newChildren);
        }
    }
}
