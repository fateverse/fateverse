package cn.fateverse.admin.vo;

import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.regex.Pattern;

/**
 * @author Clay
 * @date 2022/11/2
 */
@Data
@ApiModel("用户返回实体")
public class UserVo implements Serializable {

    /**
     * 用户ID
     */
    @ApiModelProperty("用户ID")
    private Long userId;

    /**
     * 部门名称
     */
    @ApiModelProperty("部门名称")
    private String deptName;

    private Long leaderDeptId;

    private Long roleId;

    /**
     * 用户账号
     */
    @ApiModelProperty("用户账号")
    private String userName;

    private String avatar;

    private String email;

    private String userType;

    private String sex;

    /**
     * 用户昵称
     */
    @ApiModelProperty("用户昵称")
    private String nickName;

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

    /**
     * 创建时间
     */
    @ApiModelProperty("创建时间")
    private Date createTime;

    public boolean checkEmail(){
        if (StrUtil.isEmpty(email)){
            return false;
        }
        Pattern pattern =Pattern.compile("^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
                + "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$");
        return pattern.matcher(email).matches();
    }
}
