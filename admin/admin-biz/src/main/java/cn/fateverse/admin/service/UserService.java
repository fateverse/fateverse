package cn.fateverse.admin.service;

import cn.fateverse.admin.dto.UserDto;
import cn.fateverse.admin.entity.User;
import cn.fateverse.admin.query.UserQuery;
import cn.fateverse.admin.vo.UserChooseVo;
import cn.fateverse.admin.vo.UserDetailVo;
import cn.fateverse.admin.vo.UserVo;
import cn.fateverse.common.core.result.page.TableDataInfo;

import java.util.List;

/**
 * @author Clay
 * @date 2022/10/30
 */
public interface UserService {

    /**
     * 通过用户名查询用户信息
     *
     * @param username
     * @return
     */
    User searchByUserName(String username);


    /**
     * 根据用户ID搜索用户信息
     *
     * @param userId 用户ID
     * @return 用户对象
     */
    User searchUserInfoByUserId(Long userId);


    /**
     * 查询用户列表
     *
     * @param user
     * @return
     */
    List<UserVo> searchList(UserQuery user);

    /**
     * 根据角色或者是部门获取到用户信息
     *
     * @param type
     * @param chooseId
     * @return
     */
    List<UserChooseVo> searchUserChooseRoleOrDept(Integer type, Long chooseId);

    /**
     * 通过id list查询用户信息
     *
     * @param roleIds
     * @return
     */
    List<UserVo> searchListByRoleIds(List<Long> roleIds);


    /**
     * 根据userId获取用户信息
     *
     * @param userIds
     * @return
     */
    List<UserVo> searchByUserIds(List<Long> userIds);


    /**
     * 根据部门ids获取到用户信息
     *
     * @param deptIds
     * @return
     */
    List<UserVo> searchByDeptIds(List<Long> deptIds);


    /**
     * 通过用户id查询用户信息
     *
     * @param userId
     * @return
     */
    UserDetailVo searchByUserId(Long userId);

    /**
     * 校验用户是否唯一
     *
     * @param user@return
     */
    boolean checkUserNameUnique(UserDto user);

    /**
     * 校验手机号是否唯一
     *
     * @param user@return
     */
    boolean checkPhoneNumberUnique(UserDto user);

    /**
     * 校验邮箱是否唯一
     *
     * @param user@return
     */
    boolean checkEmailUnique(UserDto user);


    /**
     * 根据角色id获取到对应的用户
     *
     * @param roleId
     * @param userName
     * @param phoneNumber
     * @return
     */
    List<UserVo> searchListByRoleId(Long roleId, String userName, String phoneNumber);

    /**
     * 根据排除的角色id搜索用户列表
     *
     * @param roleId      角色id
     * @param userName    用户名
     * @param phoneNumber 电话号码
     * @return 表格数据信息
     */
    TableDataInfo<UserVo> searchUserListByExcludeRoleId(Long roleId, String userName, String phoneNumber);

    /**
     * 绑定用户与角色之间的关联关系
     *
     * @param userIds
     * @param roleId
     */
    void bindRole(List<Long> userIds, Long roleId);

    /**
     * 解除角色和用户之间的绑定关系
     *
     * @param userIds
     * @param roleId
     * @return
     */
    int unBindRole(List<Long> userIds, Long roleId);

    /**
     * 解除当前角色对应的所有用户的绑定关系
     *
     * @param roleId
     */
    void unBindAllRole(Long roleId);

    /**
     * 根据岗位id获取对应用户
     *
     * @param postId
     * @return
     */
    List<UserVo> searchListByPostId(Long postId, String userName, String phoneNumber);

    /**
     * 根据排除的帖子ID、角色ID和用户信息搜索用户列表
     *
     * @param postId      角色ID
     * @param userName    用户名
     * @param phoneNumber 电话号码
     * @return 用户数据信息
     */
    TableDataInfo<UserVo> searchUserListByExcludePostId(Long postId, String userName, String phoneNumber);

    /**
     * 绑定用户与帖子关系
     *
     * @param userIds 用户ID列表
     * @param postId  帖子ID
     */
    void bindPost(List<Long> userIds, Long postId);


    /**
     * 解除岗位和用户之间的绑定关系
     *
     * @param userIds
     * @param postId
     * @return
     */
    int unBindPost(List<Long> userIds, Long postId);

    /**
     * 接触当前岗位与所有用户的绑定关系
     *
     * @param postId 岗位id
     * @return 执行结果
     */
    int unBindAllPost(Long postId);


    /**
     * 根据部门ID、用户名和手机号码搜索用户列表
     *
     * @param deptId      部门ID
     * @param userName    用户名
     * @param phoneNumber 手机号码
     * @return 搜索结果列表
     */
    List<UserVo> searchListByDeptId(Long deptId, String userName, String phoneNumber);

    /**
     * 根据排除部门ID、用户名和手机号码搜索用户列表
     *
     * @param deptId      部门ID
     * @param userName    用户名
     * @param phoneNumber 手机号码
     * @return 搜索结果用户数据信息
     */
    TableDataInfo<UserVo> searchUserListByExcludeDeptId(Long deptId, String userName, String phoneNumber);

    /**
     * 解绑用户和部门
     *
     * @param userIds 用户ID列表
     * @param deptId  部门ID
     */
    void unBindDept(List<Long> userIds, Long deptId);

    /**
     * 解绑所有部门和用户
     *
     * @param deptId 部门ID
     */
    void unBindAllDept(Long deptId);

    /**
     * 新增用户信息
     *
     * @param dto
     * @return
     */
    int save(UserDto dto);

    /**
     * 更新用户信息
     *
     * @param dto
     * @return
     */
    int edit(UserDto dto);

    /**
     * 删除用户信息
     *
     * @param userId
     * @return
     */
    int remove(Long userId);


    /**
     * 获取所有的用户id
     *
     * @return
     */
    List<Long> searchAllUserIds();
}
