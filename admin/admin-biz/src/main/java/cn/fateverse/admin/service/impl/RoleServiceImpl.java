package cn.fateverse.admin.service.impl;

import cn.fateverse.admin.dto.RoleDto;
import cn.fateverse.admin.entity.Role;
import cn.fateverse.admin.query.RoleQuery;
import cn.fateverse.admin.vo.RoleVo;
import cn.fateverse.admin.entity.RoleMenu;
import cn.fateverse.admin.mapper.MenuMapper;
import cn.fateverse.admin.mapper.RoleMapper;
import cn.fateverse.admin.mapper.RoleMenuMapper;
import cn.fateverse.admin.service.RoleService;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.LongUtils;
import cn.fateverse.common.core.utils.ObjectUtils;
import cn.fateverse.common.core.utils.StateUtils;
import cn.fateverse.common.security.utils.SecurityUtils;
import cn.fateverse.common.mybatis.utils.PageUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author Clay
 * @date 2022/11/4
 */
@Slf4j
@Service
public class RoleServiceImpl implements RoleService {

    private final RoleMapper roleMapper;

    private final RoleMenuMapper roleMenuMapper;


    public RoleServiceImpl(RoleMapper roleMapper,
                           RoleMenuMapper roleMenuMapper) {
        this.roleMapper = roleMapper;
        this.roleMenuMapper = roleMenuMapper;
    }


    @Override
    public TableDataInfo<RoleVo> searchList(RoleQuery query) {
        PageUtils.startPage();
        List<Role> list = roleMapper.selectList(query);
        return PageUtils.convertDataTable(list, RoleVo::toRoleVo);
    }


    @Override
    public TableDataInfo<RoleVo> searchListByMenuId(Long menuId, String roleName, String roleKey) {
        PageUtils.startPage();
        List<Role> list = roleMapper.selectListByMenuId(menuId, roleName, roleKey);
        return PageUtils.convertDataTable(list, RoleVo::toRoleVo);
    }

    @Override
    public TableDataInfo<RoleVo> searchListExcludeMenuId(Long menuId, String roleName, String roleKey) {
        PageUtils.startPage();
        List<Role> list = roleMapper.searchListExcludeMenuId(menuId,roleName,roleKey);
        return PageUtils.convertDataTable(list, RoleVo::toRoleVo);
    }

    @Override
    public RoleVo searchById(Long roleId) {
        Role role = roleMapper.selectById(roleId);
        RoleVo roleVo = RoleVo.toRoleVo(role);
        Set<Long> menuIds = roleMenuMapper.selectMenuIdsByRoleId(roleId);
        roleVo.setMenuIds(menuIds);
        return roleVo;
    }

    @Override
    public List<Option> searchOption() {
        RoleQuery query = new RoleQuery();
        query.setState("1");
        List<Role> roleList = roleMapper.selectList(query);
        return roleList.stream().map(role -> Option.builder()
                .value(role.getRoleId())
                .label(role.getRoleName())
                .build()).collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int save(RoleDto dto) {
        Role role = dto.toRole();
        checkState(role.getState());
        int result = roleMapper.insert(role);
        dto.setRoleId(role.getRoleId());
        batchRoleMenu(dto, Boolean.FALSE);
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int edit(RoleDto dto) {
        Role role = dto.toRole();
        checkRoleAllowed(role);
        checkState(dto.getState());
        batchRoleMenu(dto, Boolean.TRUE);
        return roleMapper.update(role);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int editState(Long roleId, String state) {
        checkState(state);
        Role roleUpdate = Role.builder()
                .roleId(roleId)
                .state(state)
                .build();
        checkRoleAllowed(roleUpdate);
        return roleMapper.update(roleUpdate);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int remove(Long roleId) {
        if (hasUserByRoleId(roleId)) {
            throw new CustomException("当前角色拥有用户,删除失败!");
        }
        checkRoleAllowed(new Role(roleId));
        roleMenuMapper.deleteByRoleId(roleId);
        return roleMapper.delete(roleId);
    }

    @Override
    public boolean hasUserByRoleId(Long roleId) {
        return roleMapper.hasUserByRoleId(roleId) > 0;
    }

    @Override
    public boolean checkNameUnique(RoleDto dto) {
        Long roleId = LongUtils.isNull(dto.getRoleId()) ? -1L : dto.getRoleId();
        Role info = roleMapper.selectByRoleName(dto.getRoleName());
        return chickRole(info, roleId);
    }

    @Override
    public boolean checkRoleKeyUnique(RoleDto dto) {
        Long roleId = LongUtils.isNull(dto.getRoleId()) ? -1L : dto.getRoleId();
        Role info = roleMapper.selectByRoleKey(dto.getRoleKey());
        return chickRole(info, roleId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int bindMenu(Long menuId, List<Long> roleIds) {
        List<RoleMenu> roleMenuList = roleIds.stream().filter(LongUtils::isNotNull).map(roleId -> RoleMenu.builder().roleId(roleId)
                .menuId(menuId).build()).collect(Collectors.toList());
        if (roleMenuList.isEmpty()){
            throw new CustomException("角色id不能为空");
        }
        return roleMenuMapper.batch(roleMenuList);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int unBindMenu(Long menuId, List<Long> roleIds) {
        return roleMenuMapper.unBindMenu(menuId, roleIds);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int unBindAllMenu(Long menuId) {
        return roleMenuMapper.unBindAllMenu(menuId);
    }

    public void checkRoleAllowed(Role role) {
        if (!ObjectUtils.isEmpty(role.getRoleId()) && role.isAdmin()) {
            throw new CustomException("不允许操作超级管理员角色");
        }
    }

    private void batchRoleMenu(RoleDto role, boolean updateFlag) {
        Set<Long> menuIds = role.getMenuIds();
        if (updateFlag) {
//            Set<Long> checkedSet = null;
//            if (role.getRoleId().equals(1L)) {
//                checkedSet = menuMapper.selectAllMenuId();
//            } else {
//                checkedSet = menuMapper.selectCheckedMenuIdByRoleId(role.getRoleId());
//            }
//            Set<Long> userMenuIds = menuMapper.selectCheckedMenuIdByUserId(SecurityUtils.getUserId());
//            Set<Long> other = checkedSet.stream().filter(check -> !userMenuIds.contains(check)).collect(Collectors.toSet());
//            menuIds.addAll(other);
            roleMenuMapper.deleteByRoleId(role.getRoleId());
        }
        if (!menuIds.isEmpty()) {
            List<RoleMenu> roleMenuList = menuIds.stream()
                    .filter(menuId -> 0L != menuId)
                    .map(menuId -> RoleMenu.builder()
                            .menuId(menuId)
                            .roleId(role.getRoleId())
                            .build()).collect(Collectors.toList());
            if (roleMenuList.isEmpty()) {
                return;
            }
            roleMenuMapper.batch(roleMenuList);
        }
    }


    private void checkState(String state) {
        if (!StateUtils.checkStateLegal(state)) {
            throw new CustomException("状态值不合法!");
        }
    }


    private boolean chickRole(Role role, Long roleId) {
        return (!ObjectUtils.isEmpty(role) && !role.getRoleId().equals(roleId));
    }
}
