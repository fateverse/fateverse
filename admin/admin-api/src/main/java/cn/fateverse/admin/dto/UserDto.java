package cn.fateverse.admin.dto;

import cn.fateverse.admin.entity.UserBase;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * @author Clay
 * @date 2022/11/7
 */
@Data
@ApiModel("用户返回实体")
public class UserDto{


    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 部门ID
     */
    private Long deptId;

    /**
     * 用户账号
     */
    @NotBlank(message = "用户名称不能为空")
    @Size(min = 0, max = 30, message = "用户账号长度不能超过30个字符")
    private String userName;

    /**
     * 用户昵称
     */
    @NotBlank(message = "用户昵称不能为空")
    @Size(min = 0, max = 30, message = "用户昵称长度不能超过30个字符")
    private String nickName;

    /**
     * 用户邮箱
     */
    @Email(message = "邮箱格式不正确")
    @Size(min = 0, max = 50, message = "邮箱长度不能超过50个字符")
    private String email;

    /**
     * 手机号码
     */
    @Size(min = 0, max = 11, message = "手机号码长度不能超过11个字符")
    private String phoneNumber;

    /**
     * 用户性别
     */
    private String sex;

    /**
     * 密码
     */
    private String password;

    /**
     * 帐号状态（1正常 0停用）
     */
    private String state;

    /**
     * 岗位ids
     */
    @ApiModelProperty("岗位ids")
    private List<Long> postIds;
    /**
     * 角色ids
     */
    @ApiModelProperty("角色ids")
    private List<Long> roleIds;


    public UserBase toUser() {
        return UserBase.builder()
                .userId(userId)
                .deptId(deptId)
                .userName(userName)
                .nickName(nickName)
                .email(email)
                .phoneNumber(phoneNumber)
                .sex(sex)
                .password(password)
                .state(state)
                .build();
    }

}
