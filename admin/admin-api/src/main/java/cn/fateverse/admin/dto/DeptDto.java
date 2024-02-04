package cn.fateverse.admin.dto;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

/**
 * 部门表 sys_dept
 *
 * @author Clay
 * @date 2022/10/30
 */
@Data
public class DeptDto {


    /**
     * 部门ID
     */
    private Long deptId;

    /**
     * 父部门ID
     */
    private Long parentId;

    /**
     * 祖级列表
     */
    private String ancestors;

    /**
     * 部门名称
     */
    @NotBlank(message = "部门名称不能为空!")
    private String deptName;

    /**
     * 显示顺序
     */
    @NotBlank(message = "显示顺序不能为空!")
    private String orderNum;

    /**
     * 负责人
     */
    @NotBlank(message = "负责人不能为空!")
    private String leader;

    /**
     * 负责人id
     */
    @NotNull(message = "负责人id不能为空!")
    private Long leaderId;

    /**
     * 联系电话
     */
    @Pattern(message = "手机号格式错误!",regexp = "^1[0-9]{10}$")
    private String phone;

    /**
     * 邮箱
     */
    @Email(message = "邮箱格式错误!")
    private String email;

    /**
     * 部门状态:1正常,0停用
     */
    private String state;

    /**
     * 删除标志（0代表存在 2代表删除）
     */
    private String delFlag;



}
