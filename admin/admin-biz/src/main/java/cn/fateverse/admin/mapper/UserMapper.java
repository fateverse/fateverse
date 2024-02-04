package cn.fateverse.admin.mapper;

import cn.fateverse.admin.entity.User;
import cn.fateverse.admin.entity.UserBase;
import cn.fateverse.admin.query.UserQuery;
import cn.fateverse.admin.vo.UserVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author Clay
 * @date 2022/10/30
 */
public interface UserMapper {

    /**
     * 通过用户名查询用户
     *
     * @param userName 用户名
     * @return 用户对象信息
     */
    User selectByUserName(String userName);

    /**
     * 获取所有的用户id
     *
     * @return 所有用的id
     */
    List<Long> selectAllUserIds();

    /**
     * 查询用户列表
     *
     * @param query 用户查询信息
     * @return 用户信息
     */
    List<UserVo> selectList(UserQuery query);

    /**
     * 排除角色id
     *
     * @param roleId 角色id
     * @return 表格数据信息
     */
    List<UserVo> selectUserListByExcludeRoleId(@Param("roleId") Long roleId, @Param("userName") String userName, @Param("phoneNumber") String phoneNumber);


    /**
     * 根据排除的帖子ID、用户名和手机号码查询用户列表
     *
     * @param postId      排除的帖子ID
     * @param userName    用户名
     * @param phoneNumber 手机号码
     * @return 用户列表
     */
    List<UserVo> selectUserListByExcludePostId(@Param("postId") Long postId, @Param("userName") String userName, @Param("phoneNumber") String phoneNumber);


    /**
     * 根据角色id查询用户信息
     *
     * @param roleId 角色id
     * @return 用户信息
     */
    List<UserVo> selectUserListByRoleId(@Param("roleId") Long roleId, @Param("userName") String userName, @Param("phoneNumber") String phoneNumber);


    /**
     * 根据角色id list 查询用户信息
     *
     * @param roleIds 角色id列表
     * @return 用户信息
     */
    List<UserVo> selectUserListByRoleIds(List<Long> roleIds);

    /**
     * 根据用户id查询用户信息
     *
     * @param userIds 用户id列表
     * @return 用户信息
     */
    List<UserVo> selectUserByUserIds(List<Long> userIds);

    /**
     * 根据部门id列表查询用户信息
     *
     * @param deptIds 部门id列表
     * @return 用户信息
     */
    List<UserVo> selectUserByDeptIds(List<Long> deptIds);

    /**
     * 根据岗位id查询用户信息
     *
     * @param postId 岗位名称
     * @return 用户信息列表
     */
    List<UserVo> selectUserListByPostId(@Param("postId") Long postId, @Param("userName") String userName, @Param("phoneNumber") String phoneNumber);

    /**
     * 通过用户id查询用户信息
     *
     * @param userId 用户id
     * @return 用户信息
     */
    User selectUserByUserId(Long userId);

    /**
     * 校验用户是否唯一
     *
     * @param userName 用户名称
     * @return 用户信息
     */
    User selectUserInfoByUserName(String userName);

    /**
     * 校验手机号是否唯一
     *
     * @param phoneNumber 电话号码
     * @return 用户信息
     */
    User selectByPhoneNum(String phoneNumber);

    /**
     * 校验邮箱是否唯一
     *
     * @param email 邮箱
     * @return 用户信息
     */
    User selectByEmail(String email);

    /**
     * 新增用户
     *
     * @param user 用户信息
     * @return 结果
     */
    int insert(UserBase user);

    /**
     * 更新用户
     *
     * @param user 用户信息
     * @return 结果
     */
    int update(UserBase user);

    /**
     * 删除用户
     *
     * @param userId 用户id
     * @return 结果
     */
    int deleteByUserId(Long userId);

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
     * 根据部门ID、用户名和手机号码搜索排除指定部门的用户列表
     *
     * @param deptId      部门ID
     * @param userName    用户名
     * @param phoneNumber 手机号码
     * @return 搜索结果列表
     */
    List<UserVo> searchUserListByExcludeDeptId(Long deptId, String userName, String phoneNumber);

    /**
     * 解除用户与部门的绑定关系
     *
     * @param userIds 用户ID列表
     * @param deptId  部门ID
     */
    void unBindDept(List<Long> userIds, Long deptId);

    /**
     * 解除部门的所有绑定关系
     *
     * @param deptId 部门ID
     */
    void unBindAllDept(Long deptId);


}
