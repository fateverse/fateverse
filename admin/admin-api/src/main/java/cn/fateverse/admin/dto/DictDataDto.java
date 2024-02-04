package cn.fateverse.admin.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author Clay
 * @date 2023/5/18
 */
@Data
@ApiModel("字典数据实体")
public class DictDataDto {
    /**
     * 字典编码
     */
    private Long dictCode;
    /**
     * 字典排序
     */
    @ApiModelProperty("字典排序")
    @NotNull(message = "状态不能为空!")
    private String dictSort;
    /**
     * 字典标签
     */
    @ApiModelProperty("字典标签")
    @NotNull(message = "字典标签不能为空!")
    private String dictLabel;
    /**
     * 字典键值
     */
    @ApiModelProperty("字典键值")
    @NotNull(message = "字典键值不能为空!")
    private String dictValue;
    /**
     * 字典类型
     */
    @ApiModelProperty("字典类型")
    @NotNull(message = "字典类型不能为空!")
    private String dictType;
    /**
     * 样式属性（其他样式扩展）
     */
    @ApiModelProperty("样式属性（其他样式扩展）")
    private Boolean isType;
    /**
     * 表格回显样式
     */
    @ApiModelProperty("表格回显样式")
    private String listClass;
    /**
     * 字典显示主题(ui框架时)or文字颜色(自定义颜色时)
     */
    @ApiModelProperty("字典显示主题(ui框架时)or文字颜色(自定义颜色时)")
    private String theme;
    /**
     * 是否默认（Y是 N否）
     */
    @ApiModelProperty("是否默认（Y是 N否）")
    private Integer isDefault;
    /**
     * 状态（1正常 0停用）
     */
    @ApiModelProperty(value = "状态（1正常 0停用）",required = true)
    @NotNull(message = "状态不能为空!")
    private String state;
}
