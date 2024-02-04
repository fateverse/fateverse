package cn.fateverse.admin.controller;

import cn.fateverse.admin.dto.RoleDto;
import cn.fateverse.admin.entity.Role;
import cn.fateverse.admin.entity.User;
import cn.fateverse.admin.query.RoleQuery;
import cn.fateverse.admin.vo.RoleVo;
import cn.fateverse.common.core.entity.IdWrapper;
import cn.hutool.core.util.StrUtil;
import cn.fateverse.admin.service.MenuService;
import cn.fateverse.admin.service.RoleService;
import cn.fateverse.admin.service.UserService;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.LongUtils;
import cn.fateverse.common.core.utils.ObjectUtils;
import cn.fateverse.common.security.entity.LoginUser;
import cn.fateverse.common.security.service.TokenService;
import cn.fateverse.common.security.utils.SecurityUtils;
import cn.fateverse.common.log.annotation.Log;
import cn.fateverse.common.log.enums.BusinessType;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

/**
 * @author Clay
 * @date 2022/11/4
 */
@Api(tags = "角色管理")
@RestController
@RequestMapping("/role")
public class RoleController {


    private final RoleService roleService;

    private final UserService userService;

    private final MenuService menuService;

    private final TokenService tokenService;

    public RoleController(RoleService roleService, UserService userService, MenuService menuService, TokenService tokenService) {
        this.roleService = roleService;
        this.userService = userService;
        this.menuService = menuService;
        this.tokenService = tokenService;
    }


    @ApiOperation("获取角色列表")
    @GetMapping
    @PreAuthorize("@ss.hasPermission('admin:role:list')")
    public Result<TableDataInfo<RoleVo>> list(RoleQuery query) {
        TableDataInfo<RoleVo> dataInfo = roleService.searchList(query);
        return Result.ok(dataInfo);
    }


    @ApiOperation("查询角色信息")
    @GetMapping("/{roleId}")
    @PreAuthorize("@ss.hasPermission('admin:role:info')")
    public Result<RoleVo> info(@PathVariable Long roleId) {
        checkRoleId(roleId);
        RoleVo vo = roleService.searchById(roleId);
        return Result.ok(vo);
    }


    @ApiOperation("根据菜单id获取角色列表")
    @GetMapping("/menu/list")
    public Result<TableDataInfo<RoleVo>> roleExcludeMenuId(Long menuId, String roleName, String roleKey) {
        if (ObjectUtils.isEmpty(menuId)) {
            return Result.error("菜单id不能为空!");
        }
        TableDataInfo<RoleVo> dataInfo = roleService.searchListExcludeMenuId(menuId, roleName, roleKey);
        return Result.ok(dataInfo);
    }


    @ApiOperation("根据菜单id获取分配的角色信息")
    @GetMapping("/menu")
    public Result<TableDataInfo<RoleVo>> menuRole(Long menuId, String roleName, String roleKey) {
        if (ObjectUtils.isEmpty(menuId)) {
            return Result.error("菜单id不能为空!");
        }
        TableDataInfo<RoleVo> dataInfo = roleService.searchListByMenuId(menuId, roleName, roleKey);
        return Result.ok(dataInfo);
    }


    @ApiOperation("建立角色菜单绑定关系")
    @PutMapping("/bind/menu")
    @PreAuthorize("@ss.hasPermission('admin:user:bindMenu')")
    @Log(title = "建立角色用户绑定关系", businessType = BusinessType.UPDATE)
    public Result<Void> bindRole(@RequestBody IdWrapper wrapper) {
        checkRoleIds(wrapper.getIds());
        LongUtils.checkId(wrapper.getId(), "菜单id不能为空");
        roleService.bindMenu(wrapper.getId(), wrapper.getIds());
        return Result.ok();
    }


    @ApiOperation("解除角色与菜单之间的绑定状态")
    @PutMapping("/unbind/menu")
    @PreAuthorize("@ss.hasPermission('admin:role:unBindMenu')")
    @Log(title = "解除角色用户绑定关系", businessType = BusinessType.UPDATE)
    public Result<Void> unBindMenu(@RequestBody IdWrapper wrapper) {
        checkRoleIds(wrapper.getIds());
        LongUtils.checkId(wrapper.getId(), "菜单id不能为空");
        roleService.unBindMenu(wrapper.getId(), wrapper.getIds());
        return Result.ok();
    }

    @ApiOperation("解除当前角色对应的所有菜单的绑定关系")
    @PutMapping("/all/unbind/menu")
    @PreAuthorize("@ss.hasPermission('admin:role:unBindMenu')")
    @Log(title = "解除当前角色对应的所有用户的绑定关系", businessType = BusinessType.UPDATE)
    public Result<Void> unBindAllMenu(@RequestBody IdWrapper wrapper) {
        LongUtils.checkId(wrapper.getId(), "菜单id不能为空");
        roleService.unBindAllMenu(wrapper.getId());
        return Result.ok();
    }


    @ApiOperation("查询角色信息")
    @GetMapping("/option")
    public Result<List<Option>> option() {
        List<Option> option = roleService.searchOption();
        return Result.ok(option);
    }


    @ApiOperation("新增角色")
    @PostMapping
    @Log(title = "新增角色", businessType = BusinessType.INSERT)
    @PreAuthorize("@ss.hasPermission('admin:role:add')")
    public Result<Void> add(@RequestBody @Validated RoleDto role) {
        checkNameAndKey(role);
        roleService.save(role);
        return Result.ok();
    }

    @ApiOperation("修改角色")
    @PutMapping
    @Log(title = "修改角色", businessType = BusinessType.UPDATE)
    @PreAuthorize("@ss.hasPermission('admin:role:edit')")
    public Result<Void> edit(@NotNull @RequestBody @Validated RoleDto role) {
        checkRoleId(role.getRoleId());
        checkNameAndKey(role);
        roleService.edit(role);
        checkUserRoleUpdate(role);
        return Result.ok();
    }

    @ApiOperation("修改角色状态")
    @PutMapping("/state")
    @Log(title = "修改角色状态", businessType = BusinessType.UPDATE)
    @PreAuthorize("@ss.hasPermission('admin:role:edit')")
    public Result<Void> state(@RequestBody RoleDto role) {
        if (LongUtils.isNull(role.getRoleId())) {
            return Result.error("角色id不能为空!");
        }
        if (StrUtil.isEmpty(role.getState())) {
            return Result.error("状态不能为空!");
        }
        roleService.editState(role.getRoleId(), role.getState());
        checkUserRoleUpdate(role);
        return Result.ok();
    }


    @ApiOperation("删除角色")
    @DeleteMapping("/{roleId}")
    @Log(title = "删除角色", businessType = BusinessType.DELETE)
    @PreAuthorize("@ss.hasPermission('admin:role:del')")
    public Result<Void> delete(@PathVariable Long roleId) {
        checkRoleId(roleId);
        roleService.remove(roleId);
        return Result.ok();
    }


    private void checkRoleIds(List<Long> roleIds) {
        if (roleIds == null || roleIds.isEmpty()) {
            throw new CustomException("角色id不能为空!");
        }
        long count = roleIds.stream().filter(roleId -> !ObjectUtils.isEmpty(roleId)).count();
        if (count == 0) {
            throw new CustomException("角色id不能为空!");
        }
    }

    /**
     * 检查角色id
     */
    private void checkRoleId(Long roleId) {
        if (LongUtils.isNull(roleId)) {
            throw new CustomException("id不能为空");
        }
    }

    /**
     * 检查角色名称和角色关键词
     */
    private void checkNameAndKey(RoleDto dto) {
        if (roleService.checkNameUnique(dto)) {
            throw new CustomException("角色名称已存在!");
        }
        if (roleService.checkRoleKeyUnique(dto)) {
            throw new CustomException("角色权限名称已存在!");
        }
    }


    private void checkUserRoleUpdate(RoleDto role) {
        LoginUser loginUser = SecurityUtils.getLoginUser();
        if (ObjectUtils.isEmpty(loginUser) || loginUser.getUser().isAdmin()) {
            return;
        }
        List<Role> roles = loginUser.getUser().getRoles();
        boolean checked = roles.stream().anyMatch(info -> info.getRoleId().equals(role.getRoleId()));
        if (!checked) {
            return;
        }
        User user = userService.searchByUserName(loginUser.getUser().getUserName());
        Set<String> permsSet = menuService.searchPermsByUserId(user.getUserId());
        loginUser.setUser(user);
        loginUser.setPermissions(permsSet);
        tokenService.setLoginUser(loginUser);
    }


}
