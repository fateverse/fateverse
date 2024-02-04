package cn.fateverse.admin.mapper;


import cn.fateverse.admin.entity.Menu;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Set;

/**
 * @author Clay
 * @date 2022/10/30
 */
public interface MenuMapper {


    /**
     * 查询菜单列表
     *
     * @param menuName
     * @param state
     * @param excludeId
     * @param button
     * @return
     */
    List<Menu> selectList(@Param("menuName") String menuName,
                          @Param("state") String state,
                          @Param("excludeId") Long excludeId,
                          @Param("button") Boolean button);

    /**
     * 根据用户id获取到用户的菜单信息
     *
     * @param userId
     * @param excludeId
     * @return
     */
    List<Menu> selectListByUserId(@Param("userId") Long userId,
                                  @Param("menuName") String menuName,
                                  @Param("state") String state,
                                  @Param("excludeId") Long excludeId,
                                  @Param("button") Boolean button);

    /**
     * 通过id查询菜单详细信息
     *
     * @param menuId
     * @return
     */
    Menu selectById(Long menuId);

    /**
     * 根据用户ID查询权限
     *
     * @param userId 用户ID
     * @return 权限列表
     */
    Set<String> selectMenuPermsByUserId(Long userId);

    /**
     * 获取当前角色拥有的菜单权限
     *
     * @param roleId
     * @return
     */
    Set<Long> selectCheckedMenuIdByRoleId(Long roleId);

    /**
     * 根据用户id查询当前用户拥有的菜单权限集合
     *
     * @param userId
     * @return
     */
    Set<Long> selectCheckedMenuIdByUserId(Long userId);

    /**
     * 获取所有的菜单id,管理员专用
     *
     * @return
     */
    Set<Long> selectAllMenuId();

    /**
     * 获取全部的树形结构的菜单列表(为超级管理员所放行的权限),这里获取的将是路由信息,则不现实按钮
     *
     * @return
     */
    List<Menu> selectRouterMenuList();

    /**
     * 通过用户id查询到所有用的权限,这里则获取到对应用户可以选择的option
     *
     * @param userId 用户ID
     * @return
     */
    List<Menu> selectRouterMenuListByUserId(@Param("userId") Long userId);

    /**
     * 通过用户id查询到当前用户所拥有的的权限
     *
     * @param userId
     * @return
     */
    List<Menu> selectByUserId(Long userId);

    /**
     * 新增菜单
     *
     * @param menu
     * @return
     */
    int insert(Menu menu);

    /**
     * 更新菜单信息
     *
     * @param menu
     * @return
     */
    int update(Menu menu);

    /**
     * 根据id删除菜单
     *
     * @param menuId
     * @return
     */
    int deleteById(Long menuId);

    /**
     * 获取到子节点数量
     *
     * @param menuId 菜单id
     * @return 统计数量
     */
    Integer selectCountByParentId(Long menuId);

    /**
     * 通过权限字符查询到菜单信息
     *
     * @param perms 权限字符
     * @return 返回结果
     */
    List<Menu> selectByPerms(String perms);
}
