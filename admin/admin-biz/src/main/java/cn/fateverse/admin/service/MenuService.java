package cn.fateverse.admin.service;

import cn.fateverse.admin.dto.MenuDto;
import cn.fateverse.admin.vo.MenuSimpVo;
import cn.fateverse.admin.vo.MenuVo;
import cn.fateverse.admin.vo.OptionMenuVo;
import cn.fateverse.admin.vo.RouterVo;
import cn.fateverse.common.core.entity.OptionTree;

import java.util.List;
import java.util.Set;

/**
 * @author Clay
 * @date 2022/10/30
 */
public interface MenuService {
    /**
     * 根据用户ID查询权限
     *
     * @param userId 用户ID
     * @return 权限列表
     */
    Set<String> searchPermsByUserId(Long userId);

    /**
     * 获取用户路由信息
     *
     * @param userId 用户id
     * @return 路由信息
     */
    List<RouterVo> searchRouterByUserId(Long userId);

    /**
     * 获取到菜单的树形结构
     *
     * @param menuName 菜单名称
     * @param state    状态
     * @return tree简单vo
     */
    List<MenuSimpVo> searchTree(String menuName, String state);


    /**
     * 根据菜单id查询菜单信息
     *
     * @param menuId 菜单id
     * @return 菜单返回信息
     */
    MenuVo searchByMenuId(Long menuId);


    /**
     * 获取树形结构的选项
     *
     * @param excludeId 需要排除的id
     * @return 菜单选项
     */
    List<OptionTree> searchTreeOption(Long excludeId);

    /**
     * 通过角色id获取到已选择的菜单列表和当前角色已经选择的菜单
     *
     * @param roleId 角色id
     * @return 菜单选项vo
     */
    OptionMenuVo searchOptionRoleByRoleId(Long roleId);

    /**
     * 新增菜单
     *
     * @param menu 菜单对象
     * @return 影响行数
     */
    int save(MenuDto menu);

    /**
     * rpc请求新增菜单
     *
     * @param menu 菜单信息
     */
    void saveRPC(MenuDto menu);

    /**
     * 修改菜单
     *
     * @param menu 菜单对象
     * @return 影响行数
     */
    int edit(MenuDto menu);

    /**
     * 删除菜单
     *
     * @param menuId 菜单id
     * @return 影响行数
     */
    int removeById(Long menuId);

    /**
     * 取消自自定义查询id
     *
     * @param menuId 菜单id
     */
    void removeMenu(Long menuId);
}
