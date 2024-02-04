package cn.fateverse.admin.query;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 参数配置表对象 sys_config
 *
 * @author clay
 * @date 2023-06-09
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("参数配置表Query")
public class ConfigQuery {

    /**
     * 参数名称
     */
    @ApiModelProperty("参数名称")
    private String configName;

    /**
     * 参数键名
     */
    @ApiModelProperty("参数键名")
    private String configKey;

    /**
     * 系统内置（1是 0否）
     */
    @ApiModelProperty("系统内置（1是 0否）")
    private Integer configType;
}