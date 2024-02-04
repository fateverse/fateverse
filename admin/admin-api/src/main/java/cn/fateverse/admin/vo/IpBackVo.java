package cn.fateverse.admin.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author Clay
 * @date 2023-10-22
 */
@Data
@Builder
@ApiModel("ip黑名单")
@AllArgsConstructor
@NoArgsConstructor
public class IpBackVo {
    /**
     * 主键id
     */
    @ApiModelProperty("主键id")
    private Long id;
    /**
     * ip地址
     */
    @ApiModelProperty("ip地址")
    private String ipAddr;
    /**
     * ip类型 ipv4 ipv6
     */
    @ApiModelProperty("ip类型 ipv4 ipv6")
    private String type;
    /**
     * 备注信息
     */
    private String remark;

    @ApiModelProperty("创建时间")
    private Date createTime;

}
