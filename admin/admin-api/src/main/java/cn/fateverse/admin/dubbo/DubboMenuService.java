package cn.fateverse.admin.dubbo;

import cn.fateverse.admin.dto.MenuDto;
import cn.fateverse.admin.vo.MenuVo;
import cn.fateverse.admin.vo.RouterVo;
import cn.fateverse.common.core.result.Result;

import java.util.List;
import java.util.Set;

/**
 * @author Clay
 * @date 2023-02-20
 */
public interface DubboMenuService {
    /**
     * 获取到用户的菜单权限信息
     *
     * @param userId 用户id
     * @return 当前用户的权限信息
     */
    Set<String> selectMenuPermsByUserId(Long userId);

    /**
     * 保存登录信息
     *
     * @param userId 用户id
     * @return 当前用户的路由信息
     */
    List<RouterVo> selectMenuRouterByUserId(Long userId);

    /**
     * 新增菜单
     *
     * @param menuDto 菜单对象
     * @return 操作结果
     */
    Result<Long> insertMenu(MenuDto menuDto);

    /**
     * 删除菜单
     *
     * @param menuId 菜单id
     */
    void removeMenu(Long menuId);

    /**
     * 根据id查询父级菜单信息
     *
     * @param menuId 父级菜单
     * @return 菜单信息
     */
    Result<MenuVo> selectMenuByMenuId(Long menuId);

}
