package cn.fateverse.admin.query;

import cn.fateverse.common.core.entity.QueryTime;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author Clay
 * @date 2022/11/9
 */
@Data
public class DictTypeQuery extends QueryTime {

    /**
     * 字典名称
     */
    @ApiModelProperty("字典名称")
    private String dictName;
    /**
     * 字典类型
     */
    @ApiModelProperty("字典类型")
    private String dictType;

    /**
     * 帐号状态（1正常 0停用）
     */
    @ApiModelProperty("帐号状态（1正常 0停用）")
    private String state;

}
