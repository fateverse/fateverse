package cn.fateverse.admin.query;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author Clay
 * @date 2022/11/9
 */
@Data
public class DictDataQuery {

    /**
     * 字典类型
     */
    @ApiModelProperty(value = "字典名称",required = true)
    private String dictType;
    /**
     * 字典标签
     */
    @ApiModelProperty("字典标签")
    private String dictLabel;
    /**
     * 状态（1正常 0停用）
     */
    @ApiModelProperty("帐号状态（1正常 0停用）")
    private String state;
}
