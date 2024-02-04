package cn.fateverse.admin.vo;

import cn.fateverse.admin.entity.Config;
import cn.fateverse.common.core.annotaion.Excel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 参数配置表对象 sys_config
 *
 * @author clay
 * @date 2023-06-09
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("参数配置表Vo")
public class ConfigVo {

    /**
     * 参数主键
     */
    @ApiModelProperty("参数主键")
    private Integer configId;

    /**
     * 参数名称
     */
    @ApiModelProperty("参数名称")
    @Excel("参数名称")
    private String configName;

    /**
     * 参数键名
     */
    @ApiModelProperty("参数键名")
    @Excel("参数键名")
    private String configKey;

    /**
     * 参数键值
     */
    @ApiModelProperty("参数键值")
    @Excel("参数键值")
    private String configValue;

    /**
     * 系统内置（1是 0否）
     */
    @ApiModelProperty("系统内置（1是 0否）")
    @Excel("系统内置（1是 0否）")
    private Integer configType;

    /**
     * 备注
     */
    @ApiModelProperty("备注")
    @Excel("备注")
    private String remark;

    public static ConfigVo toConfigVo(Config config) {
        return ConfigVo.builder()
                .configId(config.getConfigId())
                .configName(config.getConfigName())
                .configKey(config.getConfigKey())
                .configValue(config.getConfigValue())
                .configType(config.getConfigType())
                .remark(config.getRemark())
                .build();
    }
}