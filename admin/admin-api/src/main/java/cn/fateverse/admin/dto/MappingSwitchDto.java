package cn.fateverse.admin.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * @author Clay
 * @date 2024/2/5 16:37
 */
@Data
public class MappingSwitchDto {
    /**
     * key作为唯一编号
     */
    @NotBlank(message = "唯一编号不能为空")
    private String key;

    /**
     * 当前方法的状态,true为正常放行,false为关闭
     */
    @NotNull(message = "状态不能为空")
    private Boolean state;

}
