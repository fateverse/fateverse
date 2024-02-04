package cn.fateverse.auth.service.impl;

import cn.fateverse.admin.dubbo.DubboMenuService;
import cn.fateverse.admin.entity.User;
import cn.fateverse.common.security.entity.LoginUser;
import org.apache.dubbo.config.annotation.DubboReference;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

/**
 * 用户权限处理
 *
 * @author Clay
 * @date 2022/10/30
 */
@Component
public class PermissionService {

    @DubboReference
    private DubboMenuService menuService;

    /**
     * 获取到菜单权限信息
     *
     * @param loginUser 登录用户
     */
    public void getMenuPermission(LoginUser loginUser) {
        User user = loginUser.getUser();
        Set<String> perms = new HashSet<>();
        if (user.isAdmin()) {
            perms.add("*:*:*");
        } else {
            Set<String> menuSet = menuService.selectMenuPermsByUserId(user.getUserId());
            perms.addAll(menuSet);
        }
        loginUser.setPermissions(perms);
    }

}
