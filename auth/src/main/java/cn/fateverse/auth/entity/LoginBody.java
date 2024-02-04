package cn.fateverse.auth.entity;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * @author Clay
 * @date 2022/10/27
 */
@Data
@ApiModel("登录数据实体")
public class LoginBody {
    /**
     * 用户名
     */
    @ApiModelProperty("用户名")
    @NotBlank(message = "用户名不能为空")
    private String username;

    /**
     * 用户密码
     */
    @ApiModelProperty("用户密码")
    @NotBlank(message = "密码不能为空")
    private String password;
    /**
     * 验证码uuid
     */
    @ApiModelProperty("验证码uuid")
    @NotBlank(message = "验证码uuid")
    private String uuid;
    /**
     * 验证码
     */
    @ApiModelProperty("验证码")
    @NotBlank(message = "验证码不能为空")
    private String code;

}
