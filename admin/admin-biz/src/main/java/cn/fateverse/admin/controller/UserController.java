package cn.fateverse.admin.controller;

import cn.fateverse.admin.dto.UserDto;
import cn.fateverse.admin.query.UserQuery;
import cn.fateverse.admin.vo.UserChooseVo;
import cn.fateverse.admin.vo.UserDetailVo;
import cn.fateverse.admin.vo.UserVo;
import cn.fateverse.common.core.entity.IdWrapper;
import cn.hutool.core.util.StrUtil;
import cn.fateverse.admin.service.PostService;
import cn.fateverse.admin.service.RoleService;
import cn.fateverse.admin.service.UserService;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.LongUtils;
import cn.fateverse.common.security.annotation.Anonymity;
import cn.fateverse.common.log.annotation.Log;
import cn.fateverse.common.log.enums.BusinessType;
import cn.fateverse.common.mybatis.utils.PageUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.regex.Pattern;

/**
 * @author Clay
 * @date 2022/10/29
 */
@Api(tags = "用户管理")
@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    private final RoleService roleService;

    private final PostService postService;

    public UserController(UserService userService,
                          RoleService roleService,
                          PostService postService) {
        this.userService = userService;
        this.roleService = roleService;
        this.postService = postService;
    }


    @ApiOperation("获取用户列表")
    @GetMapping
    @PreAuthorize("@ss.hasPermission('admin:user:list')")
    public Result<TableDataInfo<UserVo>> list(UserQuery userQuery) {
        PageUtils.startPage();
        List<UserVo> userVos = userService.searchList(userQuery);
        TableDataInfo<UserVo> dataTable = PageUtils.getDataTable(userVos);
        return Result.ok(dataTable);
    }

    @ApiOperation("根据角色或者部门获取到对应的数据")
    @GetMapping("/choose/{type}/{chooseId}")
    @Anonymity
    public Result<List<UserChooseVo>> choose(@PathVariable Integer type, @PathVariable Long chooseId) {
        if (null == type || null == chooseId || type > 1 || type < 0) {
            return Result.error("参数异常!");
        }
        List<UserChooseVo> userChooseList = userService.searchUserChooseRoleOrDept(type, chooseId);
        return Result.ok(userChooseList);
    }

    @ApiOperation("获取用户列表")
    @GetMapping("/info/{userId}")
    @PreAuthorize("@ss.hasPermission('admin:user:info')")
    public Result<UserDetailVo> info(@PathVariable Long userId) {
        checkUserId(userId);
        UserDetailVo userDetail = userService.searchByUserId(userId);
        List<Option> roleOption = roleService.searchOption();
        List<Option> postOption = postService.searchOption();
        userDetail.setRoleList(roleOption);
        userDetail.setPostList(postOption);
        return Result.ok(userDetail);
    }

    @ApiOperation("根据角色id获取用户信息")
    @GetMapping("/role/{roleId}")
    public Result<TableDataInfo<UserVo>> role(@PathVariable Long roleId, String userName, String phoneNumber) {
        LongUtils.checkId(roleId, "角色id不能为空!");
        PageUtils.startPage();
        List<UserVo> userList = userService.searchListByRoleId(roleId, userName, phoneNumber);
        TableDataInfo<UserVo> dataTable = PageUtils.getDataTable(userList);
        return Result.ok(dataTable);
    }

    @ApiOperation("排除角色id获取用户信息")
    @GetMapping("/role/exclude/{roleId}")
    public Result<TableDataInfo<UserVo>> excludeRole(@PathVariable Long roleId, String userName, String phoneNumber) {
        LongUtils.checkId(roleId, "角色id不能为空!");
        TableDataInfo<UserVo> table = userService.searchUserListByExcludeRoleId(roleId, userName, phoneNumber);
        return Result.ok(table);
    }

    @ApiOperation("建立角色用户绑定关系")
    @PutMapping("/bind/role")
    @PreAuthorize("@ss.hasPermission('admin:user:bindRole')")
    @Log(title = "建立角色用户绑定关系", businessType = BusinessType.UPDATE)
    public Result<Void> bindRole(@RequestBody IdWrapper wrapper) {
        checkUserId(wrapper.getIds());
        LongUtils.checkId(wrapper.getId(), "角色id不能为空");
        userService.bindRole(wrapper.getIds(), wrapper.getId());
        return Result.ok();
    }

    @ApiOperation("解除角色与用户之间的绑定状态")
    @PutMapping("/unbind/role")
    @PreAuthorize("@ss.hasPermission('admin:user:unBindRole')")
    @Log(title = "解除角色用户绑定关系", businessType = BusinessType.UPDATE)
    public Result<Void> unBindRole(@RequestBody IdWrapper wrapper) {
        checkUserId(wrapper.getIds());
        LongUtils.checkId(wrapper.getId(), "角色id不能为空");
        userService.unBindRole(wrapper.getIds(), wrapper.getId());
        return Result.ok();
    }

    @ApiOperation("解除当前角色对应的所有用户的绑定关系")
    @PutMapping("/all/unbind/role")
    @PreAuthorize("@ss.hasPermission('admin:user:unBindRole')")
    @Log(title = "解除当前角色对应的所有用户的绑定关系", businessType = BusinessType.UPDATE)
    public Result<Void> unBindAllRole(@RequestBody IdWrapper wrapper) {
        LongUtils.checkId(wrapper.getId(), "角色id不能为空");
        userService.unBindAllRole(wrapper.getId());
        return Result.ok();
    }

    //    @ApiOperation("根据角色id获取用户信息")
//    @GetMapping("/dept/{roleId}")
    public Result<TableDataInfo<UserVo>> dept(@PathVariable Long deptId, String userName, String phoneNumber) {
        LongUtils.checkId(deptId, "角色id不能为空!");
        PageUtils.startPage();
        List<UserVo> userList = userService.searchListByDeptId(deptId, userName, phoneNumber);
        TableDataInfo<UserVo> dataTable = PageUtils.getDataTable(userList);
        return Result.ok(dataTable);
    }

    //    @ApiOperation("排除角色id获取用户信息")
//    @GetMapping("/dept/exclude/{deptId}")
    public Result<TableDataInfo<UserVo>> excludeDept(@PathVariable Long deptId, String userName, String phoneNumber) {
        LongUtils.checkId(deptId, "角色id不能为空!");
        TableDataInfo<UserVo> table = userService.searchUserListByExcludeDeptId(deptId, userName, phoneNumber);
        return Result.ok(table);
    }

    //    @ApiOperation("解除角色与用户之间的绑定状态")
//    @PutMapping("/unbind/{userIds}/dept/{deptId}")
//    @PreAuthorize("@ss.hasPermission('admin:user:unBindRole')")
//    @Log(title = "解除角色用户绑定关系", businessType = BusinessType.UPDATE)
    public Result<Void> unBindDept(@PathVariable List<Long> userIds, @PathVariable Long deptId) {
        checkUserId(userIds);
        LongUtils.checkId(deptId, "角色id不能为空");
        userService.unBindDept(userIds, deptId);
        return Result.ok();
    }

    //    @ApiOperation("解除当前角色对应的所有用户的绑定关系")
//    @PutMapping("/unbind/dept/{deptId}")
//    @PreAuthorize("@ss.hasPermission('admin:user:unBindRole')")
//    @Log(title = "解除当前角色对应的所有用户的绑定关系", businessType = BusinessType.UPDATE)
    public Result<Void> unBindAllDept(@PathVariable Long deptId) {
        LongUtils.checkId(deptId, "角色id不能为空");
        userService.unBindAllDept(deptId);
        return Result.ok();
    }

    @ApiOperation("根据岗位id获取用户信息")
    @GetMapping("/post/{postId}")
    public Result<TableDataInfo<UserVo>> post(@PathVariable Long postId, String userName, String phoneNumber) {
        if (LongUtils.isNull(postId)) {
            return Result.error("岗位id不能为空!");
        }
        PageUtils.startPage();
        List<UserVo> userList = userService.searchListByPostId(postId, userName, phoneNumber);
        TableDataInfo<UserVo> dataTable = PageUtils.getDataTable(userList);
        return Result.ok(dataTable);
    }


    @ApiOperation("排除岗位id获取用户信息")
    @GetMapping("/post/exclude/{postId}")
    public Result<TableDataInfo<UserVo>> excludePost(@PathVariable Long postId, String userName, String phoneNumber) {
        LongUtils.checkId(postId, "角色id不能为空!");
        TableDataInfo<UserVo> table = userService.searchUserListByExcludePostId(postId, userName, phoneNumber);
        return Result.ok(table);
    }


    @ApiOperation("建立角色用户绑定关系")
    @PutMapping("/bind/post")
    @PreAuthorize("@ss.hasPermission('admin:user:bindPost')")
    @Log(title = "建立角色用户绑定关系", businessType = BusinessType.UPDATE)
    public Result<Void> bindPost(@RequestBody IdWrapper wrapper) {
        checkUserId(wrapper.getIds());
        LongUtils.checkId(wrapper.getId(), "角色id不能为空");
        userService.bindPost(wrapper.getIds(), wrapper.getId());
        return Result.ok();
    }

    @ApiOperation("解除岗位与用户之间的绑定状态")
    @PutMapping("/unbind/post")
    @PreAuthorize("@ss.hasPermission('admin:user:unbindPost')")
    @Log(title = "解除角色用户绑定关系", businessType = BusinessType.UPDATE)
    public Result<Void> unBindPost(@RequestBody IdWrapper wrapper) {
        checkUserId(wrapper.getIds());
        LongUtils.checkId(wrapper.getId(), "岗位id不能为空");
        userService.unBindPost(wrapper.getIds(), wrapper.getId());
        return Result.ok();
    }

    @ApiOperation("解除当前岗位对应的所有用户的绑定关系")
    @PutMapping("/all/unbind/post")
    @PreAuthorize("@ss.hasPermission('admin:user:unbindPost')")
    @Log(title = "解除当前角色对应的所有用户的绑定关系", businessType = BusinessType.UPDATE)
    public Result<Void> unBindAllPost(@RequestBody IdWrapper wrapper) {
        LongUtils.checkId(wrapper.getId(), "岗位id不能为空");
        userService.unBindAllPost(wrapper.getId());
        return Result.ok();
    }

    @ApiOperation("新增用户")
    @PostMapping
    @Log(title = "新增用户", businessType = BusinessType.INSERT)
    @PreAuthorize("@ss.hasPermission('admin:user:add')")
    public Result<Void> add(@NotNull @RequestBody @Validated UserDto user) {
        if (StrUtil.isEmpty(user.getPassword())) {
            return Result.error("初始密码不能为空");
        }
        checkPhone(user.getPhoneNumber());
        userService.save(user);
        return Result.ok();
    }


    @ApiOperation("修改用户")
    @PutMapping
    @Log(title = "修改用户", businessType = BusinessType.UPDATE)
    @PreAuthorize("@ss.hasPermission('admin:user:edit')")
    public Result<Void> edit(@NotNull @RequestBody @Validated UserDto user) {
        checkUserId(user.getUserId());
        checkPhone(user.getPhoneNumber());
        userService.edit(user);
        return Result.ok();
    }

    @ApiOperation("删除用户")
    @DeleteMapping("/{userId}")
    @Log(title = "删除用户", businessType = BusinessType.DELETE)
    public Result<Void> del(@PathVariable Long userId) {
        checkUserId(userId);
        userService.remove(userId);
        return Result.ok();
    }

    /**
     * 检查用户id是都为空
     */
    private void checkUserId(List<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            throw new CustomException("用户id不能为空!");
        }
    }

    private void checkUserId(Long userId) {
        if (LongUtils.isNull(userId)) {
            throw new CustomException("用户id不能为空!");
        }
    }

    private void checkPhone(String phone) {
        if (!StrUtil.isEmpty(phone) && !Pattern.matches("^1[0-9]{10}$", phone)) {
            throw new CustomException("手机号格式错误!");
        }
    }


}
