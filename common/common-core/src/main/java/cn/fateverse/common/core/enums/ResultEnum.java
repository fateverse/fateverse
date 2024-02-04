package cn.fateverse.common.core.enums;

import org.springframework.http.HttpStatus;

/**
 * @author Clay
 * @date 2023-05-10
 */
public enum ResultEnum {
    /**
     * 返回状态枚举
     */
    SUCCESS(1000, "操作成功", HttpStatus.OK),

    NO_DATA(1001, "查询结果为空", HttpStatus.OK),

    RESUBMIT_LOCK(2002, "重复提交", HttpStatus.INTERNAL_SERVER_ERROR),

    ERROR(2000, "操作失败", HttpStatus.INTERNAL_SERVER_ERROR),

    SYS_ERROR(2001, "系统异常", HttpStatus.INTERNAL_SERVER_ERROR),

    SENTINEL_FLOW(3000, "限流了", HttpStatus.INTERNAL_SERVER_ERROR),

    SENTINEL_PARAM_FLOW(3000, "热点参数限流", HttpStatus.INTERNAL_SERVER_ERROR),

    SENTINEL_SYSTEM(3000, "系统规则负载等不满足要求", HttpStatus.INTERNAL_SERVER_ERROR),

    SENTINEL_AUTHORITY(3000, "授权规则不通过", HttpStatus.UNAUTHORIZED),

    SENTINEL_DEGRADE(3000, "降级了", HttpStatus.INTERNAL_SERVER_ERROR),
    ;

    ResultEnum(int code, String msg, HttpStatus status) {
        this.code = code;
        this.msg = msg;
        this.status = status;
    }

    public final int code;

    public final String msg;

    public final transient HttpStatus status;


}
