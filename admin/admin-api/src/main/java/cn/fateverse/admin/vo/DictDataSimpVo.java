package cn.fateverse.admin.vo;

import cn.fateverse.admin.entity.DictData;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

/**
 * @author Clay
 * @date 2022/11/11
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("Cache字典数据实体")
public class DictDataSimpVo {
    /**
     * 字典标签
     */
    @ApiModelProperty("字典标签")
    @NotNull(message = "字典标签不能为空!")
    private String label;
    /**
     * 字典键值
     */
    @ApiModelProperty("字典键值")
    @NotNull(message = "字典键值不能为空!")
    private String value;
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
     * 字典对象转换成为简单的字典返回Vo
     *
     * @param dictData 字典对象
     * @return 简单vo对象
     */
    public static DictDataSimpVo dictDataToDictDataVo(DictData dictData) {
        return DictDataSimpVo.builder()
                .label(dictData.getDictLabel())
                .value(dictData.getDictValue())
                .isType(dictData.getIsType())
                .listClass(dictData.getListClass())
                .isDefault(dictData.getIsDefault())
                .build();
    }


}
