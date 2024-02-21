package cn.fateverse.admin.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;


/**
 * 字典数据返回vo
 *
 * @author Clay
 * @date 2023/05/18
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DictDataVo implements Serializable {
    /**
     * 字典编码
     */
    private Long dictCode;
    /**
     * 字典排序
     */
    @ApiModelProperty("字典排序")
    private Integer dictSort;
    /**
     * 字典标签
     */
    @ApiModelProperty("字典标签")
    private String dictLabel;
    /**
     * 字典键值
     */
    @ApiModelProperty("字典键值")
    private String dictValue;
    /**
     * 字典类型
     */
    @ApiModelProperty("字典类型")
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
    @ApiModelProperty(value = "状态（1正常 0停用）")
    private String state;


    @ApiModelProperty(value = "创建时间")
    private Date createTime;


}
