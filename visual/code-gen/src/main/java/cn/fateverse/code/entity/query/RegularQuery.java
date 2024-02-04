package cn.fateverse.code.entity.query;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 校验规则表对象 gen_regula
 *
 * @author clay
 * @date 2023-05-27
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("校验规则表Query")
public class RegularQuery {

    /**
     * 正则名称
     */
    @ApiModelProperty("正则名称")
    private String name;

    /**
     * 正则内容
     */
    @ApiModelProperty("正则内容")
    private String regular;

    /**
     * 是否启用 1:启动 2:关闭
     */
    @ApiModelProperty("是否启用 1:启动 0:关闭")
    private Integer enable;
}
