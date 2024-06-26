package cn.fateverse.log.query;

import cn.fateverse.common.core.entity.QueryTime;
import lombok.Data;


/**
 * @Description:    日志管理->操作日志查询实体类
 * @Author: Gary
 * @DateTime:2022/11/14 20:24
 * @Version: V2.0
 */
@Data
public class OperationLogQuery extends QueryTime {

    /**
     *  系统模块
     */
    private String title;

    private String applicationName;

    /**
     *  操作人员
     */
    private String operName;

    /**
     *  操作类型
     */
    private Integer businessType;

    /**
     * 操作状态
     */
    private String state;


}
