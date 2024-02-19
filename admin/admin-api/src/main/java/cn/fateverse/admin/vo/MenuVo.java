package cn.fateverse.admin.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;

/**
 * 菜单详细返回对象
 *
 * @author Clay
 */
@Data
@ApiModel("菜单")
public class MenuVo implements Serializable {

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
     * 父菜单ID
     */
    @ApiModelProperty("父菜单ID")
    private Long parentId;

    /**
     * 显示顺序
     */
    @ApiModelProperty("显示顺序")
    private Integer orderNum;

    /**
     * 路由地址
     */
    @ApiModelProperty("路由地址")
    private String path;

    @ApiModelProperty("路径参数")
    private String pathParams;

    /**
     * 组件路径
     */
    @ApiModelProperty("组件路径")
    private String component;

    /**
     * 是否为外链（0是 1否）
     */
    @ApiModelProperty("是否为外链（0是 1否）")
    private Boolean isFrame;

    /**
     * 是否缓存（0缓存 1不缓存）
     */
    @ApiModelProperty("是否缓存（0缓存 1不缓存）")
    private Boolean isCache;

    @ApiModelProperty("不重定向")
    private Boolean noRedirect;

    @ApiModelProperty("面包屑")
    private Boolean breadcrumb;
    /**
     * 类型（D目录 M菜单 B按钮）
     */
    @ApiModelProperty("类型（D目录 M菜单 B按钮）")
    private String menuType;

    /**
     * 显示状态（0显示 1隐藏）
     */
    @ApiModelProperty("显示状态（0显示 1隐藏）")
    private String visible;

    /**
     * 菜单状态（0显示 1隐藏）
     */
    @ApiModelProperty("菜单状态（0显示 1隐藏）")
    private String state;

    /**
     * 权限字符串
     */
    @ApiModelProperty("权限字符串")
    private String perms;

    /**
     * 菜单图标
     */
    @ApiModelProperty("菜单图标")
    private String icon;

}
