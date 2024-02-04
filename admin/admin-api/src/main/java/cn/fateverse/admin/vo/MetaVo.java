package cn.fateverse.admin.vo;

import lombok.Data;

import java.io.Serializable;

/**
 * @author Clay
 * @date 2022/10/30
 */
@Data
public class MetaVo implements Serializable {
    /**
     * 设置该路由在侧边栏和面包屑中展示的名字
     */
    private String title;

    /**
     * 设置该路由的图标，对应路径src/assets/icons/svg
     */
    private String icon;

    /**
     * 设置为true，则不会被 <keep-alive>缓存
     */
    private Boolean noCache;

    /**
     * 是否重定向
     */
    private Boolean noRedirect;

    /**
     * 是否开起面包屑
     */
    private Boolean breadcrumb;

    private Boolean isFrame;

    public MetaVo() {
    }

    public MetaVo(String title, String icon) {
        this.title = title;
        this.icon = icon;
    }

    public MetaVo(String title, String icon, Boolean noCache) {
        this.title = title;
        this.icon = icon;
        this.noCache = noCache;
    }

    public MetaVo(String title, String icon, Boolean noCache, Boolean noRedirect, Boolean breadcrumb,Boolean isFrame) {
        this.title = title;
        this.icon = icon;
        this.noCache = noCache;
        this.noRedirect = noRedirect;
        this.breadcrumb = breadcrumb;
        this.isFrame = isFrame;
    }
}
