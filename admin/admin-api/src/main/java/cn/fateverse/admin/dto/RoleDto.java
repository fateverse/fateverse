package cn.fateverse.admin.dto;

import cn.fateverse.admin.entity.Role;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import java.util.Set;

/**
 * @author Clay
 * @date 2022/11/5
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("角色接受对象")
public class RoleDto {

    /**
     * 角色ID
     */
    @ApiModelProperty("角色id")
    private Long roleId;

    /**
     * 角色名称
     */
    @ApiModelProperty("角色名称")
    @NotBlank(message = "角色名称不能为空!")
    private String roleName;

    /**
     * 角色关键词
     */
    @ApiModelProperty("角色关键词")
    @NotBlank(message = "角色关键词不能为空!")
    private String roleKey;

    /**
     * 角色排序
     */
    @ApiModelProperty("角色排序")
    @NotBlank(message = "角色排序不能为空!")
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
    @NotBlank(message = "角色状态不能为空!")
    private String state;

    /**
     * 菜单组
     */
    @ApiModelProperty("菜单组")
    private Set<Long> menuIds;

    /**
     * 部门组（数据权限）
     */
    @ApiModelProperty("部门组（数据权限）")
    private Long[] deptIds;

    public Role toRole() {
        return Role.builder()
                .roleId(roleId)
                .roleName(roleName)
                .roleKey(roleKey)
                .roleSort(roleSort)
                .dataScope(dataScope)
                .state(state)
                .delFlag("0")
                .build();
    }
}
