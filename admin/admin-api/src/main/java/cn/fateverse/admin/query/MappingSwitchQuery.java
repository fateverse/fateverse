package cn.fateverse.admin.query;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author Clay
 * @date 2024/2/5 14:35
 */
@Data
@ApiModel("接口开关Query")
public class MappingSwitchQuery {

    @ApiModelProperty("应用名称")
    private String applicationName;

    @ApiModelProperty("类别名称")
    private String className;

    @ApiModelProperty("方法名称")
    private String methodName;
}
