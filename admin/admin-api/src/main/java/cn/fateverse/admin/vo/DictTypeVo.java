package cn.fateverse.admin.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * @author Clay
 * @date 2022/11/9
 */
@Data
@Builder
@ApiModel("字典返回实体")
public class DictTypeVo {
    /**
     * 字典id
     */
    @ApiModelProperty("字典id")
    private Long dictId;
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

    /**
     * 创建时间
     */
    @ApiModelProperty("创建时间")
    private LocalDateTime createTime;


}
