package cn.fateverse.admin.query;

import cn.fateverse.common.core.entity.QueryTime;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author Clay
 * @date 2022/11/2
 */
@Data
@ApiModel("用户查询对象")
public class UserQuery  extends QueryTime {

    /**
     * 部门ID
     */
    @ApiModelProperty("部门ID")
    private Long deptId;

    /**
     * 用户账号
     */
    @ApiModelProperty("用户账号")
    private String userName;

    /**
     * 手机号码
     */
    @ApiModelProperty("手机号码")
    private String phoneNumber;

    /**
     * 帐号状态（1正常 0停用）
     */
    @ApiModelProperty("帐号状态（1正常 0停用）")
    private String state;


}
