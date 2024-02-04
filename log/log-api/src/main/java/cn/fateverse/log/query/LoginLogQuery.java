package cn.fateverse.log.query;

import cn.fateverse.common.core.entity.QueryTime;
import io.swagger.annotations.ApiModel;
import lombok.Data;

/**
 * @Description:    日志管理->登录日志查询实体类
 * @Author: Gary
 * @DateTime:2022/11/15 20:24
 * @Version: V2.0
 */
@Data
@ApiModel("登录日志查询实体")
public class LoginLogQuery extends QueryTime {

    /**
     *  登录地址
     */
    private String ipAddr;

    /**
     *  用户名称
     */
    private String userName;

    /**
     * 登录状态
     */
    private String state;









}
