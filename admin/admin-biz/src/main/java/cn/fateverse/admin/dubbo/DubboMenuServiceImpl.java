package cn.fateverse.admin.dubbo;

import cn.fateverse.admin.dto.MenuDto;
import cn.fateverse.admin.service.MenuService;
import cn.fateverse.admin.vo.MenuVo;
import cn.fateverse.admin.vo.RouterVo;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.utils.MenuTypeUtils;
import org.apache.dubbo.config.annotation.DubboService;

import java.util.List;
import java.util.Set;

/**
 * @author Clay
 * @date 2023-02-20
 */
@DubboService
public class DubboMenuServiceImpl implements DubboMenuService {


    private final MenuService menuService;

    public DubboMenuServiceImpl(MenuService menuService) {
        this.menuService = menuService;
    }

    @Override
    public Set<String> selectMenuPermsByUserId(Long userId) {
        return menuService.searchPermsByUserId(userId);
    }

    @Override
    public List<RouterVo> selectMenuRouterByUserId(Long userId) {
        return menuService.searchRouterByUserId(userId);
    }


    @Override
    public Result<Long> insertMenu(MenuDto menuDto) {
        if (MenuTypeUtils.checkMenuTypeLegal(menuDto.getMenuType())) {
            return Result.error("菜单类型错误");
        }
        menuService.saveRPC(menuDto);
        return Result.ok(menuDto.getMenuId());
    }

    @Override
    public void removeMenu(Long menuId) {
        menuService.removeMenu(menuId);
    }


    @Override
    public Result<MenuVo> selectMenuByMenuId(Long menuId) {
        MenuVo menu = menuService.searchByMenuId(menuId);
        return Result.ok(menu);
    }
}