package cn.fateverse.admin.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * @author Clay
 * @date 2023-10-22
 */
@Data
public class IpBackDto {
    /**
     * 主键id
     */
    @ApiModelProperty("主键id")
    private Long id;
    /**
     * ip地址
     */
    @NotBlank(message = "ip地址不能为空")
    @ApiModelProperty("ip地址")
    private String ipAddr;

}
