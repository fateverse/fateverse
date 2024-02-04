package cn.fateverse.admin.entity;

import lombok.Builder;
import lombok.Data;

/**
 * @author Clay
 * @date 2022/11/6
 */
@Data
@Builder
public class RoleMenu {
    /**
     * 角色id
     */
    private Long roleId;
    /**
     * 菜单id
     */
    private Long menuId;

}
