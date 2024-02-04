package cn.fateverse.code.entity.dto;

import cn.fateverse.code.entity.Regular;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * 校验规则表对象 gen_regula
 *
 * @author clay
 * @date 2023-05-27
 */
@Data
@ApiModel("校验规则表Dto")
public class RegularDto {

    /**
     * id
     */
    @ApiModelProperty("id")
    private Long id;

    /**
     * 正则名称
     */
    @ApiModelProperty("正则名称")
    @NotBlank(message = "正则名称不能为空!")
    private String name;

    /**
     * 正则内容
     */
    @ApiModelProperty("正则内容")
    @NotBlank(message = "正则内容不能为空!")
    private String regular;

    /**
     * 验证内容
     */
    @ApiModelProperty("验证内容")
    @NotBlank(message = "验证内容不能为空!")
    private String validation;

    /**
     * 是否启用 1:启动 2:关闭
     */
    @ApiModelProperty("是否启用 1:启动 0:关闭")
    @NotNull(message = "是否启用不能为空!")
    private String enable;

    public Regular toRegula() {
        return Regular.builder()
                .id(id)
                .name(name)
                .regular(regular)
                .validation(validation)
                .enable(enable)
                .build();
    }
}
