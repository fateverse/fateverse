package cn.fateverse.admin.query;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Clay
 * @date 2022/11/26
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostQuery {

    /**
     * 岗位编码
     */
    @ApiModelProperty("岗位编码")
    private String postCode;

    /**
     * 岗位名称
     */
    @ApiModelProperty("岗位名称")
    private String postName;

    /**
     * 状态（1正常 0停用）
     */
    @ApiModelProperty("状态（1正常 0停用）")
    private String state;
}
