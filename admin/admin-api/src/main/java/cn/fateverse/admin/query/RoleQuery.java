package cn.fateverse.admin.query;

import cn.fateverse.common.core.entity.QueryTime;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author Clay
 * @date 2022/11/4
 */
@Data
@ApiModel("角色查询实体")
public class RoleQuery extends QueryTime {
    /**
     * 权限字符
     */
    @ApiModelProperty("角色名称")
    private String roleName;

    /**
     * 权限字符
     */
    @ApiModelProperty("权限字符")
    private String roleKey;
    /**
     * 帐号状态（1正常 0停用）
     */
    @ApiModelProperty("帐号状态（1正常 0停用）")
    private String state;
}
