package cn.fateverse.admin.entity;

import cn.fateverse.common.core.annotaion.EnableAutoField;
import cn.fateverse.common.core.entity.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 *
 * @author Clay
 * @date 2022/10/30
 */
@Data
@Builder
@EnableAutoField
@AllArgsConstructor
@NoArgsConstructor
public class Role  extends BaseEntity {

    /**
     * 角色ID
     */
    private Long roleId;

    /**
     * 角色名称
     */
    private String roleName;

    /**
     * 角色关键词
     */
    private String roleKey;

    /**
     * 角色排序
     */
    private Integer roleSort;

    /**
     * 数据范围（1：所有数据权限；2：自定义数据权限；3：本部门数据权限；4：本部门及以下数据权限）
     */
    private String dataScope;

    /**
     * 角色状态（1正常 0停用）
     */
    private String state;

    /**
     * 删除标志（0代表存在 1代表删除）
     */
    @JsonIgnore
    private String delFlag;

    private Integer roleType = 0;

    @JsonIgnore
    public boolean isAdmin() {
        return isAdmin(this.roleId);
    }

    @JsonIgnore
    public static boolean isAdmin(Long roleId) {
        return roleId != null && 1L == roleId;
    }

    public Role(Long roleId) {
        this.roleId = roleId;
    }


}
