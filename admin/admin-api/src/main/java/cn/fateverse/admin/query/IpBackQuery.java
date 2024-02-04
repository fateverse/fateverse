package cn.fateverse.admin.query;

import cn.fateverse.common.core.entity.QueryTime;
import lombok.Data;

/**
 * @author Clay
 * @date 2023-10-22
 */
@Data
public class IpBackQuery extends QueryTime {
    /**
     * ip地址
     */
    private String ipAddr;
    /**
     * ip类型 ipv4 ipv6
     */
    private String type;

}
