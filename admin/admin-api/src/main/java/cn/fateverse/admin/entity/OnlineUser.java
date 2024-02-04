package cn.fateverse.admin.entity;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

/**
 * @author Clay
 * @date 2022/11/13
 */
@Data
@Builder
@ApiModel("在线用户实体")
public class OnlineUser {

    /**
     * 会话id
     */
    @ApiModelProperty("会话id")
    private String tokenId;

    /**
     * 用户名
     */
    @ApiModelProperty("用户名")
    private String username;

    /**
     * 部门名称
     */
    @ApiModelProperty("部门名称")
    private String deptName;
    /**
     * 登录ip
     */
    @ApiModelProperty("登录ip")
    private String ipAddr;
    /**
     * 登录地点
     */
    @ApiModelProperty("登录地点")
    private String loginLocation;
    /**
     * 浏览器类型
     */
    @ApiModelProperty("浏览器类型")
    private String browser;
    /**
     * 操作系统
     */
    @ApiModelProperty("操作系统")
    private String os;

    /**
     * 登录时间
     */
    @ApiModelProperty("登录时间")
    private Date loginTime;


}
