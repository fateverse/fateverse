package cn.fateverse.admin.vo;

import cn.fateverse.admin.entity.Role;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;


/**
 * @author Clay
 * @date 2023-05-26
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoleVo {

    @ApiModelProperty("角色id")
    private Long roleId;

    @ApiModelProperty("角色名称")
    private String roleName;


    @ApiModelProperty("角色权限字符串")
    private String roleKey;

    @ApiModelProperty("角色排序")
    private String roleSort;

    /**
     * 数据范围（1：所有数据权限；2：自定义数据权限；3：本部门数据权限；4：本部门及以下数据权限）
     */
    @ApiModelProperty("数据范围（1：所有数据权限；2：自定义数据权限；3：本部门数据权限；4：本部门及以下数据权限）")
    private String dataScope;

    /**
     * 角色状态（1正常 0停用）
     */
    @ApiModelProperty("角色状态（1正常 0停用）")
    private String state;

    /**
     * 菜单组
     */
    @ApiModelProperty("菜单组")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Set<Long> menuIds;

    /**
     * 部门组（数据权限）
     */
    @ApiModelProperty("部门组（数据权限）")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long[] deptIds;
    private Date createTime;
    private Date updateTime;

    public static RoleVo toRoleVo(Role role){
        return RoleVo.builder()
                .roleId(role.getRoleId())
                .roleName(role.getRoleName())
                .roleKey(role.getRoleKey())
                .roleSort(role.getRoleSort())
                .dataScope(role.getDataScope())
                .state(role.getState())
                .createTime(role.getCreateTime())
                .updateTime(role.getUpdateTime())
                .build();
    }
}
