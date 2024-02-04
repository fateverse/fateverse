package cn.fateverse.admin.mapper;

import cn.fateverse.admin.entity.RoleMenu;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Set;

/**
 * @author Clay
 * @date 2022/11/6
 */
public interface RoleMenuMapper {

    /**
     * 根据角色id获取到菜单列表
     *
     * @param roleId 角色id
     * @return 菜单列表
     */
    Set<Long> selectMenuIdsByRoleId(Long roleId);

    /**
     * 批量新增roleMenu映射关系
     *
     * @param list
     * @return
     */
    int batch(List<RoleMenu> list);

    /**
     * 根据角色id删除角色菜单映射表
     *
     * @param roleId
     * @return
     */
    int deleteByRoleId(Long roleId);

    /**
     * 根据菜单id删除角色菜单映射表
     *
     * @param menuId
     * @return
     */
    int deleteByMenuId(Long menuId);

    /**
     * 取消菜单绑定
     *
     * @param menuId  菜单id
     * @param roleIds 角色ids
     * @return 执行结果
     */
    int unBindMenu(@Param("menuId") Long menuId, @Param("roleIds") List<Long> roleIds);

    /**
     * 取消当前菜单绑定的所有角色信息
     *
     * @param menuId 菜单id
     * @return 执行结果
     */
    int unBindAllMenu(Long menuId);
}
