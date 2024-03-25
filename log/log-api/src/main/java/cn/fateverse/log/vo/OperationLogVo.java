package cn.fateverse.log.vo;

import cn.fateverse.log.entity.OperationLog;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

/**
 * @author Clay
 * @date 2022/11/1
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OperationLogVo implements Serializable {

    /**
     * 日志主键
     */
    @JsonSerialize(using = ToStringSerializer.class)
    private Long operId;

    /**
     * 操作模块
     */
    private String title;

    private String applicationName;

    /**
     * 业务类型（0其它 1新增 2修改 3删除）
     */
    private Integer businessType;

    /**
     * 请求方法
     */
    private String method;

    /**
     * 请求方式
     */
    private String requestMethod;

    /**
     * 操作类别（0其它 1后台用户 2手机端用户）
     */
    private Integer operatorType;

    /**
     * 操作人员
     */
    private String operName;

    /**
     * 请求url
     */
    private String operUrl;

    /**
     * 操作地址
     */
    private String operIp;

    /**
     * 操作地点
     */
    private String operLocation;

    /**
     * 请求参数
     */
    private String operParam;

    /**
     * 返回参数
     */
    private String jsonResult;

    /**
     * 操作状态（0正常 1异常）
     */
    private Integer state;

    /**
     * 错误消息
     */
    private String errorMsg;

    /**
     * 异常栈信息
     */
    private String errorStackTrace;

    /**
     * 操作时间
     */
    private Date operTime;

    /**
     * 消耗时间
     */
    private Long consumeTime;


    public static OperationLogVo toOperationLogVo(OperationLog operationLog) {
        return OperationLogVo.builder()
                .operId(operationLog.getOperId())
                .applicationName(operationLog.getApplicationName())
                .title(operationLog.getTitle())
                .businessType(operationLog.getBusinessType())
                .method(operationLog.getMethod())
                .requestMethod(operationLog.getRequestMethod())
                .operatorType(operationLog.getOperatorType())
                .operName(operationLog.getOperName())
                .operUrl(operationLog.getOperUrl())
                .operIp(operationLog.getOperIp())
                .operLocation(operationLog.getOperLocation())
                .operParam(operationLog.getOperParam())
                .jsonResult(operationLog.getJsonResult())
                .state(operationLog.getState())
                .errorMsg(operationLog.getErrorMsg())
                .operTime(operationLog.getOperTime())
                .consumeTime(operationLog.getConsumeTime())
                .build();
    }
}
