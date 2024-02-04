package cn.fateverse.admin.controller;

import cn.fateverse.admin.dto.MenuDto;
import cn.fateverse.admin.vo.MenuSimpVo;
import cn.fateverse.admin.vo.MenuVo;
import cn.fateverse.admin.vo.OptionMenuVo;
import cn.fateverse.admin.service.MenuService;
import cn.fateverse.admin.vo.RoleVo;
import cn.fateverse.common.core.entity.OptionTree;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.utils.LongUtils;
import cn.fateverse.common.core.utils.MenuTypeUtils;
import cn.fateverse.common.core.utils.ObjectUtils;
import cn.fateverse.common.log.annotation.Log;
import cn.fateverse.common.log.enums.BusinessType;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Clay
 * @date 2022/10/30
 */
@Api(tags = "菜单管理")
@RestController
@RequestMapping("/menu")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    /**
     * 获取到菜单list数据,tree格式输出
     *
     * @return
     */
    @ApiOperation("获取到菜单list数据,tree格式输出")
    @GetMapping
    @PreAuthorize("@ss.hasPermission('admin:menu:list')")
    public Result<List<MenuSimpVo>> list(@ApiParam(value = "菜单名称", name = "menuName", required = false) String menuName,
                                         @ApiParam(value = "状态(1:正常,0:失效)", name = "state", required = false) String state) {
        List<MenuSimpVo> menuList = menuService.searchTree(menuName, state);
        return Result.ok(menuList);
    }


    @ApiOperation("获取树形接口的option")
    @GetMapping("/option/{excludeId}")
    public Result<List<OptionTree>> option(@PathVariable Long excludeId) {
        if (null != excludeId && excludeId.equals(0L)){
            excludeId = null;
        }
        List<OptionTree> optionTreeList = menuService.searchTreeOption(excludeId);
        return Result.ok(optionTreeList);
    }

    @ApiOperation("获取树形接口的option")
    @GetMapping("/option/role/{roleId}")
    public Result<OptionMenuVo> optionRole(@PathVariable Long roleId) {
        OptionMenuVo optionMenuVo = menuService.searchOptionRoleByRoleId(roleId);
        return Result.ok(optionMenuVo);
    }

    @ApiOperation("获取树形接口的option")
    @GetMapping("/info/{menuId}")
    public Result<MenuVo> info(@PathVariable Long menuId) {
        ObjectUtils.checkPk(menuId);
        MenuVo menu = menuService.searchByMenuId(menuId);
        return Result.ok(menu);
    }


    @ApiOperation("新增菜单")
    @PostMapping
    @Log(title = "新增菜单", businessType = BusinessType.INSERT)
    @PreAuthorize("@ss.hasPermission('admin:menu:add')")
    public Result<Void> add(@RequestBody @Validated MenuDto menu) {
        checkMenuType(menu);
        menuService.save(menu);
        return Result.ok();
    }


    @ApiOperation("更新菜单")
    @PutMapping
    @Log(title = "更新菜单", businessType = BusinessType.UPDATE)
    @PreAuthorize("@ss.hasPermission('admin:menu:edit')")
    public Result<Void> edit(@RequestBody @Validated MenuDto menu) {
        checkMenuId(menu.getMenuId());
        checkMenuType(menu);
        menuService.edit(menu);
        return Result.ok();
    }

    @ApiOperation("删除菜单")
    @DeleteMapping("/{menuId}")
    @Log(title = "删除菜单", businessType = BusinessType.DELETE)
    @PreAuthorize("@ss.hasPermission('admin:menu:del')")
    public Result<Void> del(@PathVariable Long menuId) {
        checkMenuId(menuId);
        menuService.removeById(menuId);
        return Result.ok();
    }


    public void checkMenuType(MenuDto menu) {
        if (MenuTypeUtils.checkMenuTypeLegal(menu.getMenuType())) {
            throw new CustomException("菜单类型不合法!");
        }
    }

    public void checkMenuId(Long menuId) {
        if (LongUtils.isNull(menuId)) {
            throw new CustomException("id不能为空");
        }
    }


}
