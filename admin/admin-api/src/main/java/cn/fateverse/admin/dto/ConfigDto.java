package cn.fateverse.admin.dto;

import cn.fateverse.admin.entity.Config;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * 参数配置表对象 sys_config
 *
 * @author clay
 * @date 2023-06-09
 */
@Data
@ApiModel("参数配置表Dto")
public class ConfigDto {

    /**
     * 参数主键
     */
    @ApiModelProperty("参数主键")
    private Integer configId;

    /**
     * 参数名称
     */
    @NotNull(message = "参数名称不能为空!")
    @ApiModelProperty("参数名称")
    private String configName;

    /**
     * 参数键名
     */
    @NotNull(message = "参数键名不能为空!")
    @ApiModelProperty("参数键名")
    private String configKey;

    /**
     * 参数键值
     */
    @NotNull(message = "参数键值不能为空!")
    @ApiModelProperty("参数键值")
    private String configValue;

    /**
     * 系统内置（1是 0否）
     */
    @NotNull(message = "是否系统内置不能为空!")
    @ApiModelProperty("系统内置（1是 0否）")
    private Integer configType;

    /**
     * 备注
     */
    @ApiModelProperty("备注")
    private String remark;

    public Config toConfig() {
        Config build = Config.builder()
                .configId(configId)
                .configName(configName)
                .configKey(configKey)
                .configValue(configValue)
                .configType(configType)
                .build();
        build.setRemark(remark);
        return build;
    }
}