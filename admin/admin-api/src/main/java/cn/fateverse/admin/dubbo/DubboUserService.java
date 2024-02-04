package cn.fateverse.admin.dubbo;

import cn.fateverse.admin.entity.User;
import cn.fateverse.admin.vo.UserVo;

import java.util.List;

/**
 * @author Clay
 * @date 2023-02-20
 */

public interface DubboUserService {
    /**
     * 通过用户名查询用户信息
     *
     * @param username 用户名称
     * @return 用户信息
     */
    User getUserByUsername(String username);

    /**
     * 根据用户id查询用户信息
     *
     * @param userId 用户id
     * @return 用户信息
     */
    User getUserByUserId(Long userId);

    /**
     * 根据roleId查询用户列表
     *
     * @param roleIds 角色id列表
     * @return 用户信息列表
     */
    List<UserVo> searchUserListByRoleIds(List<Long> roleIds);

    /**
     * 根据用户id查询用户信息
     *
     * @param userIds 用户id列表
     * @return 用户信息列表
     */
    List<UserVo> searchUserListByUserIds(List<Long> userIds);

    /**
     * 根据部门id查询用户信息
     *
     * @param deptIds 部门信息列表
     * @return 部门列表
     */
    List<UserVo> searchUserByDeptIds(List<Long> deptIds);

    /**
     * 获取所有的用户id
     *
     * @return 所有用户的id
     */
    List<Long> searchAllUserIds();
}
