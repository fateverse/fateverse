package cn.fateverse.code.entity.vo;

import cn.fateverse.code.entity.Regular;
import cn.fateverse.common.core.annotaion.Excel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * 校验规则表对象 gen_regula
 *
 * @author clay
 * @date 2023-05-27
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("校验规则表Vo")
public class RegularVo {

    /**
     * id
     */
    @ApiModelProperty("id")
    private Long id;

    /**
     * 正则名称
     */
    @ApiModelProperty("正则名称")
    @Excel("正则名称")
    private String name;

    /**
     * 正则内容
     */
    @ApiModelProperty("正则内容")
    @Excel("正则内容")
    private String regular;

    /**
     * 验证内容
     */
    @ApiModelProperty("验证内容")
    private String validation;

    /**
     * 是否启用 1:启动 2:关闭
     */
    @ApiModelProperty("是否启用 1:启动 2:关闭")
    @Excel(value = "是否启用",dictType = "regular_enable")
    private String enable;

    @Excel("创建时间")
    private Date createTime;

    @Excel("是否启用")
    private Date updateTime;

    public static RegularVo toRegulaVo(Regular regular) {
        return RegularVo.builder()
                .id(regular.getId())
                .name(regular.getName())
                .regular(regular.getRegular())
                .validation(regular.getValidation())
                .enable(regular.getEnable())
                .createTime(regular.getCreateTime())
                .updateTime(regular.getUpdateTime())
                .build();
    }
}
