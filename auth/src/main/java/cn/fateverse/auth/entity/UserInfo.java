package cn.fateverse.auth.entity;

import cn.fateverse.admin.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
 * @author Clay
 * @date 2022/11/3
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserInfo {

    /**
     * 用户信息
     */
    private User user;

    /**
     * 用户信息
     */
    private Set<String> roles;

    /**
     * 权限列表
     */
    private Set<String> permissions;



}
