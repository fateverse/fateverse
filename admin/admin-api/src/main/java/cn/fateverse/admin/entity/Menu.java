package cn.fateverse.admin.entity;

import cn.fateverse.common.core.annotaion.EnableAutoField;
import cn.fateverse.common.core.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 菜单权限表 sys_menu
 *
 * @author Clay
 */
@Data
@Builder
@EnableAutoField
@NoArgsConstructor
@AllArgsConstructor
public class Menu extends BaseEntity {


    /**
     * 菜单ID
     */
    private Long menuId;

    /**
     * 菜单名称
     */
    private String menuName;

    /**
     * 父菜单ID
     */
    private Long parentId;

    /**
     * 显示顺序
     */
    private Integer orderNum;

    /**
     * 路由地址
     */
    private String path;

    /**
     * 路径参数
     */
    private String pathParams;

    /**
     * 组件路径
     */
    private String component;

    /**
     * 是否为外链（0是 1否）
     */
    private Boolean isFrame;

    /**
     * 是否缓存（0缓存 1不缓存）
     */
    private Boolean isCache;


    private Boolean noRedirect;


    private Boolean breadcrumb;
    /**
     * 类型（D目录 M菜单 B按钮）
     */
    private String menuType;

    /**
     * 显示状态（0显示 1隐藏）
     */
    private String visible;

    /**
     * 菜单状态（0显示 1隐藏）
     */
    private String state;

    /**
     * 权限字符串
     */
    private String perms;

    /**
     * 菜单图标
     */
    private String icon;

}
