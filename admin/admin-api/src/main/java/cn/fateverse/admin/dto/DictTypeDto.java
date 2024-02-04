package cn.fateverse.admin.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author Clay
 * @date 2022/11/9
 */
@Data
@ApiModel("字典类型实体")
public class DictTypeDto {

    /**
     * 字典主键
     */
    @ApiModelProperty("字典主键")
    private Long dictId;
    /**
     * 字典名称
     */
    @ApiModelProperty("字典名称")
    @NotNull(message = "字典名称不能为空!")
    private String dictName;
    /**
     * 字典类型
     */
    @ApiModelProperty("字典类型")
    @NotNull(message = "字典类型不能为空!")
    private String dictType;
    /**
     * 字典状态（1正常 0停用）
     */
    @ApiModelProperty("字典状态")
    @NotNull(message = "字典状态不能为空!")
    private String state;


}
