package cn.fateverse.admin.dubbo;

import cn.fateverse.admin.entity.User;
import cn.fateverse.admin.service.UserService;
import cn.fateverse.admin.vo.UserVo;
import cn.fateverse.common.core.exception.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.apache.dubbo.config.annotation.DubboService;

import java.util.List;

/**
 * @author Clay
 * @date 2023-02-20
 */
@Slf4j
@DubboService
public class DubboUserServiceImpl implements DubboUserService {

    private final UserService userService;

    public DubboUserServiceImpl(UserService userService) {
        this.userService = userService;
    }


    @Override
    public User getUserByUsername(String username) {
        log.info("用户登录:{}", username);
        return userService.searchByUserName(username);
    }

    @Override
    public User getUserByUserId(Long userId) {
        return userService.searchUserInfoByUserId(userId);
    }

    @Override
    public List<UserVo> searchUserListByRoleIds(List<Long> roleIds) {
        if (roleIds.isEmpty()) {
            throw new CustomException("角色id不能为空");
        }
        return userService.searchListByRoleIds(roleIds);
    }

    @Override
    public List<UserVo> searchUserListByUserIds(List<Long> userIds) {
        if (userIds.isEmpty()) {
            throw new CustomException("用户id不能为空");
        }
        return userService.searchByUserIds(userIds);
    }

    @Override
    public List<UserVo> searchUserByDeptIds(List<Long> deptIds) {
        if (deptIds.isEmpty()) {
            throw new CustomException("部门id不能为空");
        }
        return userService.searchByDeptIds(deptIds);
    }

    @Override
    public List<Long> searchAllUserIds() {
        return userService.searchAllUserIds();
    }
}
