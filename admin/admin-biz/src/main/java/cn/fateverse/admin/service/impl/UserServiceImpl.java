package cn.fateverse.admin.service.impl;

import cn.fateverse.admin.dto.UserDto;
import cn.fateverse.admin.entity.*;
import cn.fateverse.admin.mapper.*;
import cn.fateverse.admin.query.RoleQuery;
import cn.fateverse.admin.query.UserQuery;
import cn.fateverse.admin.vo.UserChooseVo;
import cn.fateverse.admin.vo.UserDetailVo;
import cn.fateverse.admin.vo.UserVo;
import cn.hutool.core.util.StrUtil;
import cn.fateverse.admin.entity.User;
import cn.fateverse.admin.service.UserService;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.LongUtils;
import cn.fateverse.common.core.utils.ObjectUtils;
import cn.fateverse.common.mybatis.utils.PageUtils;
import cn.fateverse.common.security.utils.SecurityUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author Clay
 * @date 2022/10/30
 */
@Slf4j
@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;

    private final UserRoleMapper userRoleMapper;

    private final UserPostMapper userPostMapper;

    private final RoleMapper roleMapper;

    private final DeptMapper deptMapper;

    public UserServiceImpl(UserMapper userMapper,
                           UserRoleMapper userRoleMapper,
                           UserPostMapper userPostMapper,
                           RoleMapper roleMapper, DeptMapper deptMapper) {
        this.userMapper = userMapper;
        this.userRoleMapper = userRoleMapper;
        this.userPostMapper = userPostMapper;
        this.roleMapper = roleMapper;
        this.deptMapper = deptMapper;
    }

    @Override
    public User searchByUserName(String username) {
        return userMapper.selectByUserName(username);
    }

    @Override
    public User searchUserInfoByUserId(Long userId) {
        return userMapper.selectUserByUserId(userId);
    }

    @Override
    public List<UserVo> searchList(UserQuery user) {
        return userMapper.selectList(user);
    }

    @Override
    public List<UserChooseVo> searchUserChooseRoleOrDept(Integer type, Long chooseId) {
        List<UserChooseVo> result;
        switch (type) {
            // 0代表角色
            case 0:
                result = chooseRole(chooseId);
                break;
            // 1代表部门
            case 1:
                result = chooseDept(chooseId);
                break;
            default:
                throw new CustomException("参数异常");
        }
        return result;
    }

    @Override
    public List<UserVo> searchListByRoleIds(List<Long> roleIds) {
        return userMapper.selectUserListByRoleIds(roleIds);
    }

    @Override
    public List<UserVo> searchByUserIds(List<Long> userIds) {
        return userMapper.selectUserByUserIds(userIds);
    }


    @Override
    public List<UserVo> searchByDeptIds(List<Long> deptIds) {
        return userMapper.selectUserByDeptIds(deptIds);

    }

    @Override
    public UserDetailVo searchByUserId(Long userId) {
        User user = userMapper.selectUserByUserId(userId);
        List<Long> roleIds = user.getRoles().stream().map(Role::getRoleId).collect(Collectors.toList());
        user.setDept(null);
        user.setRoles(null);
        user.setPassword(null);
        List<Long> postIds = userPostMapper.selectPostIdListByUserId(userId);
        return UserDetailVo.builder()
                .user(user)
                .postIds(postIds)
                .roleIds(roleIds)
                .build();
    }

    @Override
    public boolean checkUserNameUnique(UserDto user) {
        Long userId = getUserId(user);
        User info = userMapper.selectUserInfoByUserName(user.getUserName());
        return checkUser(info, userId);
    }

    @Override
    public boolean checkPhoneNumberUnique(UserDto user) {
        if (StrUtil.isEmpty(user.getPhoneNumber())) {
            return false;
        }
        Long userId = getUserId(user);
        User info = userMapper.selectUserInfoByUserName(user.getPhoneNumber());
        return checkUser(info, userId);
    }

    @Override
    public boolean checkEmailUnique(UserDto user) {
        if (StrUtil.isEmpty(user.getEmail())) {
            return false;
        }
        Long userId = getUserId(user);
        User info = userMapper.selectByEmail(user.getEmail());
        return checkUser(info, userId);
    }

    @Override
    public List<UserVo> searchListByRoleId(Long roleId, String userName, String phoneNumber) {
        return userMapper.selectUserListByRoleId(roleId, userName, phoneNumber);
    }

    @Override
    public TableDataInfo<UserVo> searchUserListByExcludeRoleId(Long roleId, String userName, String phoneNumber) {
        PageUtils.startPage();
        List<UserVo> list = userMapper.selectUserListByExcludeRoleId(roleId, userName, phoneNumber);
        Long total = PageUtils.getTotal(list);
        return PageUtils.convertDataTable(list, total);
    }



    @Override
    @Transactional(rollbackFor = Exception.class)
    public void bindRole(List<Long> userIds, Long roleId) {
        List<UserRole> userRoleList = userIds.stream().filter(LongUtils::isNotNull)
                .map(userId -> UserRole.builder().roleId(roleId).userId(userId).build())
                .collect(Collectors.toList());
        if (!userRoleList.isEmpty()) {
            userRoleMapper.batchInsert(userRoleList);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int unBindRole(List<Long> userIds, Long roleId) {
        return userRoleMapper.unBind(userIds, roleId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void unBindAllRole(Long roleId) {
        userRoleMapper.deleteByRoleId(roleId);
    }

    @Override
    public List<UserVo> searchListByPostId(Long postId, String userName, String phoneNumber) {
        return userMapper.selectUserListByPostId(postId, userName, phoneNumber);
    }

    @Override
    public TableDataInfo<UserVo> searchUserListByExcludePostId(Long postId, String userName, String phoneNumber) {
        PageUtils.startPage();
        List<UserVo> list = userMapper.selectUserListByExcludePostId(postId, userName, phoneNumber);
        Long total = PageUtils.getTotal(list);
        return PageUtils.convertDataTable(list, total);
    }


    @Override
    public void bindPost(List<Long> userIds, Long postId) {
        List<UserPost> userPostList = userIds.stream().filter(LongUtils::isNotNull)
                .map(userId -> UserPost.builder().userId(userId).postId(postId).build())
                .collect(Collectors.toList());
        if (!userPostList.isEmpty()) {
            userPostMapper.batchInsert(userPostList);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int unBindPost(List<Long> userIds, Long postId) {
        return userPostMapper.removeBind(userIds, postId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int unBindAllPost(Long postId) {
        return userPostMapper.removeBindByPostId(postId);
    }


    /**
     * 选择部门
     *
     * @param deptId
     * @return
     */
    private List<UserChooseVo> chooseDept(Long deptId) {
        List<Dept> deptList = deptMapper.selectListByDeptParentId(deptId);
        List<UserChooseVo> result = deptList.stream().map(dept -> UserChooseVo.toUserChooseByDept(dept, deptId)).collect(Collectors.toList());
        List<UserVo> userList = userMapper.selectUserByDeptIds(Collections.singletonList(deptId));
        userList.forEach(user -> result.add(UserChooseVo.toUserChooseByUser(user, deptId)));
        return result;
    }

    /**
     * 选择角色
     *
     * @param roleId 角色id
     * @return 选择成功的用户信息
     */
    private List<UserChooseVo> chooseRole(Long roleId) {
        if (roleId.equals(0L)) {
            List<Role> roleList = roleMapper.selectList(new RoleQuery());
            return roleList.stream().map(UserChooseVo::toUserChooseByRole).collect(Collectors.toList());
        } else {
            List<UserVo> userList = userMapper.selectUserListByRoleId(roleId, null, null);
            return userList.stream().map(user ->
                    UserChooseVo.toUserChooseByUser(user, roleId)
            ).collect(Collectors.toList());
        }
    }

    @Override
    public List<UserVo> searchListByDeptId(Long deptId, String userName, String phoneNumber) {
        return userMapper.searchListByDeptId(deptId, userName, phoneNumber);
    }

    @Override
    public TableDataInfo<UserVo> searchUserListByExcludeDeptId(Long deptId, String userName, String phoneNumber) {
        PageUtils.startPage();
        Dept dept = deptMapper.selectById(deptId);
        if (null == dept) {
            throw new CustomException("当前部门不存在");
        }
//        dept.getAncestors()
        List<UserVo> list = userMapper.searchUserListByExcludeDeptId(deptId, userName, phoneNumber);
        Long total = PageUtils.getTotal(list);
        return PageUtils.convertDataTable(list, total);
    }

    @Override
    public void unBindDept(List<Long> userIds, Long deptId) {
        userMapper.unBindDept(userIds, deptId);
    }

    @Override
    public void unBindAllDept(Long deptId) {
        userMapper.unBindAllDept(deptId);
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public int save(UserDto dto) {
        checkUser(dto);
        UserBase user = insertInitUser(dto);
        int result = userMapper.insert(user);
        dto.setUserId(user.getUserId());
        batchUserRole(dto, Boolean.FALSE);
        batchUserPost(dto, Boolean.FALSE);
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int edit(UserDto dto) {
        if (dto.getUserId().equals(1L)) {
            throw new RuntimeException("超级管理员不允许操作!");
        }
        checkUser(dto);
        batchUserRole(dto, Boolean.TRUE);
        batchUserPost(dto, Boolean.TRUE);
        dto.setPassword(null);
        UserBase user = dto.toUser();

        return userMapper.update(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int remove(Long userId) {
        if (userId.equals(1L)) {
            throw new RuntimeException("超级管理员不允许操作!");
        }
        userRoleMapper.deleteByUserId(userId);
        userPostMapper.deleteByUserId(userId);
        return userMapper.deleteByUserId(userId);
    }



    @Override
    public List<Long> searchAllUserIds() {
        return userMapper.selectAllUserIds();
    }




    /**
     * 批量处理用户与角色之间的对应关系
     */
    private void batchUserRole(UserDto userDto, boolean updateFlag) {
        Set<Long> roleIds = new HashSet<>(userDto.getRoleIds());
        if (!roleIds.isEmpty()) {
            if (updateFlag) {
                userRoleMapper.deleteByUserId(userDto.getUserId());
            }
            List<UserRole> userRoleList = roleIds.stream().filter(LongUtils::isNotNull)
                    .map(roleId -> UserRole.builder().roleId(roleId).userId(userDto.getUserId()).build())
                    .collect(Collectors.toList());
            if (userRoleList.isEmpty()) {
                return;
            }
            userRoleMapper.batchInsert(userRoleList);
        }
    }

    /**
     * 批量处理用户与岗位之间的对应关系
     */
    private void batchUserPost(UserDto userDto, boolean updateFlag) {
        Set<Long> postIds = new HashSet<>(userDto.getPostIds());
        if (!postIds.isEmpty()) {
            if (updateFlag) {
                userPostMapper.deleteByUserId(userDto.getUserId());
            }
            List<UserPost> userPostList = postIds.stream().filter(LongUtils::isNotNull)
                    .map(postId -> UserPost.builder().postId(postId).userId(userDto.getUserId()).build())
                    .collect(Collectors.toList());
            if (userPostList.isEmpty()) {
                return;
            }
            userPostMapper.batchInsert(userPostList);
        }
    }

    /**
     * 初始化新增用户
     *
     * @param dto
     */
    private UserBase insertInitUser(UserDto dto) {
        UserBase user = dto.toUser();
        user.setPassword(SecurityUtils.encryptPassword(dto.getPassword()));
        return user;
    }

    /**
     * 获取到用户id
     *
     * @param user
     * @return
     */
    private Long getUserId(UserDto user) {
        return LongUtils.isNull(user.getUserId()) ? -1L : user.getUserId();
    }

    /**
     * 检查用户知否运行被更改
     *
     * @param user
     * @param userId
     * @return
     */
    private boolean checkUser(User user, Long userId) {
        return (!ObjectUtils.isEmpty(user) && !user.getUserId().equals(userId));
    }


    /**
     * 检查用户id是都为空
     */
    private void checkUser(UserDto user) {
        if (checkUserNameUnique(user)) {
            throw new CustomException("用户名已存在!");
        } else if (checkPhoneNumberUnique(user)) {
            throw new CustomException("电话号码已存在");
        } else if (checkEmailUnique(user)) {
            throw new CustomException("邮箱已存在");
        }
    }


}
