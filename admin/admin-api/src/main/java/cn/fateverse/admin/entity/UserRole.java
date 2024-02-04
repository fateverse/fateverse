package cn.fateverse.admin.entity;

import lombok.Builder;
import lombok.Data;

/**
 * @author Clay
 * @date 2022/11/6
 */
@Data
@Builder
public class UserRole {

    /**
     * 用户id
     */
    private Long userId;

    /**
     * 角色id
     */
    private Long roleId;

}
