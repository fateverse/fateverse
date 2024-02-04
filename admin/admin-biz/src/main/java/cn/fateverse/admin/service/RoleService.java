package cn.fateverse.admin.service;

import cn.fateverse.admin.dto.RoleDto;
import cn.fateverse.admin.query.RoleQuery;
import cn.fateverse.admin.vo.RoleVo;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.result.page.TableDataInfo;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/4
 */
public interface RoleService {

    /**
     * 查询角色列表
     *
     * @param query
     * @return
     */
    TableDataInfo<RoleVo> searchList(RoleQuery query);


    /**
     * 根据菜单ID搜索角色信息
     *
     * @param menuId   菜单ID
     * @param roleName 角色名称
     * @param roleKey  角色关键字
     * @return 角色信息列表
     */
    TableDataInfo<RoleVo> searchListByMenuId(Long menuId, String roleName, String roleKey);


    /**
     * 根据菜单ID排除条件搜索角色列表
     *
     * @param menuId   菜单ID
     * @param roleName 角色名称
     * @param roleKey  角色关键字
     * @return 符合排除条件的角色列表
     */
    TableDataInfo<RoleVo> searchListExcludeMenuId(Long menuId, String roleName, String roleKey);

    /**
     * 根据id查询角色信息
     *
     * @param roleId
     * @return
     */
    RoleVo searchById(Long roleId);

    /**
     * 返回角色的option list
     *
     * @return
     */
    List<Option> searchOption();

    /**
     * 新增角色
     *
     * @param dto
     * @return
     */
    int save(RoleDto dto);

    /**
     * 更新角色
     *
     * @param dto
     * @return
     */
    int edit(RoleDto dto);

    /**
     * 修改角色的状态
     *
     * @param roleId
     * @param state
     * @return
     */
    int editState(Long roleId, String state);

    /**
     * 删除角色
     *
     * @param roleId
     * @return
     */
    int remove(Long roleId);

    /**
     * 当前角色是否还拥有用户
     *
     * @param roleId
     * @return
     */
    boolean hasUserByRoleId(Long roleId);

    /**
     * 检查角色名称是否唯一
     *
     * @param dto
     * @return
     */
    boolean checkNameUnique(RoleDto dto);

    /**
     * 检查角色权限是否唯一
     *
     * @param dto
     * @return
     */
    boolean checkRoleKeyUnique(RoleDto dto);

    /**
     * 绑定角色与菜单
     *
     * @param menuId  菜单id
     * @param roleIds 角色id
     * @return 执行结果
     */
    int bindMenu(Long menuId, List<Long> roleIds);

    /**
     * 取消角色的绑定
     *
     * @param menuId  菜单id
     * @param roleIds 角色id
     * @return 执行结果
     */
    int unBindMenu(Long menuId, List<Long> roleIds);

    /**
     * 取消当前菜单下的所有角色
     *
     * @param menuId
     * @return
     */
    int unBindAllMenu(Long menuId);
}
