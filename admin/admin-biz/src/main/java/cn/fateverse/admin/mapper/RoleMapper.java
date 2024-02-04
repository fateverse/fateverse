package cn.fateverse.admin.mapper;

import cn.fateverse.admin.entity.Role;
import cn.fateverse.admin.query.RoleQuery;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/4
 */
public interface RoleMapper {


    /**
     * 查询角色列表
     *
     * @param query
     * @return
     */
    List<Role> selectList(RoleQuery query);

    /**
     * 根据菜单ID搜索角色信息
     *
     * @param menuId   菜单ID
     * @param roleName 角色名称
     * @param roleKey  角色关键字
     * @return 角色信息列表
     */
    List<Role> selectListByMenuId(@Param("menuId") Long menuId, @Param("roleName") String roleName, @Param("roleKey") String roleKey);


    /**
     * 根据菜单ID排除条件搜索角色列表
     *
     * @param menuId   菜单ID
     * @param roleName 角色名称
     * @param roleKey  角色关键字
     * @return 符合排除条件的角色列表
     */
    List<Role> searchListExcludeMenuId(@Param("menuId") Long menuId, @Param("roleName") String roleName, @Param("roleKey") String roleKey);


    /**
     * 根据用户id查询用户信息
     *
     * @param roleId
     * @return
     */
    Role selectById(Long roleId);

    /**
     * 新增角色
     *
     * @param role
     * @return
     */
    int insert(Role role);

    /**
     * 更新角色
     *
     * @param role
     * @return
     */
    int update(Role role);

    /**
     * 删除角色
     *
     * @param roleId
     * @return
     */
    int delete(Long roleId);

    /**
     * 检查当前角色下是否还拥有用户
     *
     * @param roleId
     * @return
     */
    int hasUserByRoleId(Long roleId);

    /**
     * 检查角色名称是否唯一
     *
     * @param roleName
     * @return
     */
    Role selectByRoleName(String roleName);

    /**
     * 检查角色权限是否唯一
     *
     * @param roleKey
     * @return
     */
    Role selectByRoleKey(String roleKey);

    /**
     * 根据角色id数组获取到角色信息
     *
     * @param roleIds
     * @return
     */
    List<Role> selectByIds(List<Long> roleIds);

}
