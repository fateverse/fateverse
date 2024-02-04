package cn.fateverse.admin.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Size;
import java.util.Date;
import java.util.List;

/**
 * @author Clay
 * @date 2022/11/5
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("菜单返回实体")
public class MenuSimpVo {

    /**
     * 菜单ID
     */
    @ApiModelProperty("菜单ID")
    private Long menuId;

    /**
     * 菜单名称
     */
    @ApiModelProperty("菜单名称")
    private String menuName;

    /**
     * 菜单图标
     */
    @ApiModelProperty("菜单图标")
    private String icon;

    /**
     * 显示顺序
     */
    @ApiModelProperty("显示顺序")
    private String orderNum;

    /**
     * 权限字符串
     */
    @ApiModelProperty("权限字符串")
    @Size(min = 0, max = 100, message = "权限标识长度不能超过100个字符")
    private String perms;

    /**
     * 组件路径
     */
    @ApiModelProperty("组件路径")
    private String component;

    /**
     * 菜单状态（0显示 1隐藏）
     */
    @ApiModelProperty("菜单状态（0显示 1隐藏）")
    private String state;

    /**
     * 创建时间
     */
    private Date createTime;


    private List<MenuSimpVo> children;

}
