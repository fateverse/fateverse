package cn.fateverse.admin.vo;

import cn.fateverse.admin.entity.Post;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * @author Clay
 * @date 2023-05-05
 */
@Data
@Builder
@ApiModel("岗位实体")
public class PostVo {

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
    private Integer postSort;
    /**
     * 状态（1正常 0停用）
     */
    @ApiModelProperty("状态（1正常 0停用）")
    @NotNull(message = "状态不能为空!")
    private String state;

    /**
     * 创建时间
     */
    @JsonFormat(locale = "zh",timezone = "GMT+8",pattern = "yyyy-MM-dd")
    private Date createTime;

    public static PostVo toPostVo(Post post){
        return PostVo.builder()
                .postId(post.getPostId())
                .postCode(post.getPostCode())
                .postName(post.getPostName())
                .postSort(post.getPostSort())
                .state(post.getState())
                .createTime(post.getCreateTime())
                .build();
    }

}
