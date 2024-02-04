package cn.fateverse.code.entity;

import cn.fateverse.common.core.entity.BaseEntity;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author Clay
 * @date 2022/11/15
 */
@Data
@ApiModel("模块实体")
public class Module extends BaseEntity {


    /**
     * 模块id
     */
    @ApiModelProperty("模块id")
    private Long modeId;
    /**
     * 模块名称
     */
    @ApiModelProperty("模块名称")
    private String modeName;
    /**
     * 模块描述
     */
    @ApiModelProperty("模块描述")
    private String modeDescribe;
}
