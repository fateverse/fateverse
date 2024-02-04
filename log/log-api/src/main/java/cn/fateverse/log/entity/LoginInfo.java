package cn.fateverse.log.entity;

import cn.fateverse.common.core.annotaion.EnableAutoField;
import cn.fateverse.common.core.annotaion.GenerateId;
import cn.fateverse.common.core.enums.GenIdEnum;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 用户登录信息
 *
 * @author Clay
 * @date 2022/11/2
 */
@Data
@EnableAutoField
public class LoginInfo implements Serializable {

    /**
     * 访问Id
     */
    @GenerateId(idType = GenIdEnum.SNOWFLAKE)
    private Long infoId;

    private String uuid;

    /**
     * 用户名
     */
    private String userName;
    /**
     * 登录ip
     */
    private String ipddr;
    /**
     * 登录地点
     */
    private String loginLocation;
    /**
     * 浏览器类型
     */
    private String browser;
    /**
     * 操作系统
     */
    private String os;
    /**
     * 登录状态
     */
    private Integer state;
    /**
     * 登录信息
     */
    private String msg;
    /**
     * 登录时间
     */
    private Date loginTime;
}
