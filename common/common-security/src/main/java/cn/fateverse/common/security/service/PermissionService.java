package cn.fateverse.common.security.service;


import cn.fateverse.common.security.configure.properties.DemoSwitchProperties;
import cn.fateverse.common.security.utils.SecurityUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import javax.annotation.Resource;
import java.util.Set;

/**
 * @author Clay
 * @date 2022/10/27
 */
public class PermissionService {

    @Resource
    private DemoSwitchProperties properties;


    /**
     * 所有权限标识
     */
    private static final String ALL_PERMISSION = "*:*:*";

    /**
     * 自定义鉴权方法
     *
     * @param permission
     * @return
     */
    public boolean hasPermission(String permission) {
        if (ObjectUtils.isEmpty(permission)) {
            return false;
        }
        checkDemoSwitch(permission);
        Set<String> permissions = SecurityUtils.getPermissions();
        if (CollectionUtils.isEmpty(permissions)) {
            return false;
        }
        return permissions.contains(ALL_PERMISSION) || permissions.contains(StringUtils.trim(permission));
    }


    private void checkDemoSwitch(String permission) {
        if (!properties.getEnable()) {
            return;
        }
        if (permission.endsWith(":del")) {
            throw new RuntimeException("演示模式,不允许删除!");
        }
        if (properties.getExcludeIdentifier() != null && properties.getExcludeIdentifier().contains(permission)) {
            throw new RuntimeException("演示模式,不允许操作!");
        }
    }


}
