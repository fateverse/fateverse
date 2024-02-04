package cn.fateverse.admin.entity;

import cn.fateverse.common.core.annotaion.EnableAutoField;
import cn.fateverse.common.core.entity.BaseEntity;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

/**
 * @author Clay
 * @date 2022/11/26
 */
@Data
@EnableAutoField
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("岗位实体")
public class Post extends BaseEntity {

    /**
     * 岗位ID
     */
    @ApiModelProperty("岗位ID")
    private Long postId;
    /**
     * 岗位编码
     */
    @ApiModelProperty("岗位编码")
    @NotNull(message = "岗位编码不能为空!")
    private String postCode;
    /**
     * 岗位名称
     */
    @ApiModelProperty("岗位名称")
    @NotNull(message = "岗位名称不能为空!")
    private String postName;
    /**
     * 显示顺序
     */
    @ApiModelProperty("显示顺序")
    @NotNull(message = "显示顺序不能为空!")
    private String postSort;
    /**
     * 状态（1正常 0停用）
     */
    @ApiModelProperty("状态（1正常 0停用）")
    @NotNull(message = "状态不能为空!")
    private String state;

}
