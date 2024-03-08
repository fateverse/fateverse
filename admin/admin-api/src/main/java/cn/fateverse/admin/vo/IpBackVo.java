package cn.fateverse.admin.vo;

import cn.fateverse.admin.entity.IpBack;
import cn.fateverse.common.core.annotaion.Excel;
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
    @Excel("id")
    private Long id;
    /**
     * ip地址
     */
    @ApiModelProperty("ip地址")
    @Excel("ip地址")
    private String ipAddr;
    /**
     * ip类型 ipv4 ipv6
     */
    @ApiModelProperty("ip类型 ipv4 ipv6")
    @Excel("ip类型 ipv4 ipv6")
    private String type;
    /**
     * 备注信息
     */
    @Excel("备注信息")
    private String remark;

    @ApiModelProperty("创建时间")
    @Excel("创建时间")
    private Date createTime;

    public static IpBackVo toIpBackVo(IpBack ipBack) {
        return IpBackVo.builder()
                .id(ipBack.getId())
                .ipAddr(ipBack.getIpAddr())
                .type(ipBack.getType())
                .remark(ipBack.getRemark())
                .createTime(ipBack.getCreateTime())
                .build();
    }
}
