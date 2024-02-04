package cn.fateverse.admin.entity;

import cn.fateverse.common.core.annotaion.EnableAutoField;
import cn.fateverse.common.core.entity.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author Clay
 * @date 2022/11/7
 */
@Data
@Builder
@EnableAutoField
@AllArgsConstructor
@NoArgsConstructor
public class UserBase extends BaseEntity {

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
    private String userName;

    /**
     * 用户昵称
     */
    private String nickName;

    /**
     * 用户邮箱
     */
    private String email;

    /**
     * 手机号码
     */
    private String phoneNumber;

    /**
     * 用户性别
     */
    private String sex;

    /**
     * 用户头像
     */
    private String avatar;

    /**
     * 密码
     */
    private String password;

    /**
     * 盐加密
     */
    @JsonIgnore
    private String salt;

    /**
     * 帐号状态（1正常 0停用）
     */
    private String state;

    /**
     * 删除标志（0代表存在 2代表删除）
     */
    @JsonIgnore
    private String delFlag;
    /**
     * 用户类型
     */
    private String userType;

    /**
     * 一个微信开放平台帐号下的应用，同一用户的 union
     */
    private String unionId;
    /**
     * 用户唯一标识
     */
    private String openId;
    /**
     * 城市
     */
    private String city;

    /**
     * 最后登录IP
     */
    private String loginIp;

    /**
     * 最后登录时间
     */
    private Date loginDate;
}
