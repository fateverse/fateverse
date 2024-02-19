package cn.fateverse.admin.utils;

import cn.fateverse.admin.vo.MetaVo;
import cn.fateverse.admin.vo.RouterVo;
import cn.hutool.core.convert.Convert;
import cn.hutool.core.util.StrUtil;
import cn.fateverse.admin.entity.Menu;
import cn.fateverse.common.core.enums.MenuEnum;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author Clay
 * @date 2022/11/5
 */
public class MenuTree {


    /**
     * 获取树形结构
     *
     * @param menuList 菜单list
     * @return 菜单路由
     */
    public static List<RouterVo> getTree(List<Menu> menuList) {
        if (chickMenuList(menuList)) {
            return null;
        }
        Map<Long, List<Menu>> menuMap = menuList.stream().collect(Collectors.groupingBy(Menu::getParentId));
        RouterVo routerVo = new RouterVo();
        routerVo.setPath("");
        return getChildrenRouterVo(0L, menuMap, routerVo);
    }


    private static boolean chickMenuList(List<Menu> menuList) {
        return null == menuList || menuList.isEmpty();
    }


    /**
     * 获取子节点
     *
     * @param parentId 父级id
     * @param menuMap  菜单映射对象
     * @return 路由信息
     */
    private static List<RouterVo> getChildrenRouterVo(Long parentId, Map<Long, List<Menu>> menuMap, RouterVo parent) {
        List<Menu> menuList = menuMap.get(parentId);
        if (chickMenuList(menuList)) {
            return null;
        }
        menuList = menuList.stream().sorted(Comparator.comparing(menu -> {
            if (null == menu.getOrderNum()) {
                return 0;
            } else {
                return menu.getOrderNum();
            }
        })).collect(Collectors.toList());
        List<RouterVo> result = new ArrayList<>();
        for (Menu menu : menuList) {
            if (MenuEnum.BUTTON.getCode().equals(menu.getMenuType())) {
                continue;
            }
            MetaVo meta = new MetaVo(menu.getMenuName(), menu.getIcon(), menu.getIsCache(), menu.getNoRedirect(), menu.getBreadcrumb(), menu.getIsFrame());
            RouterVo router = RouterVo.builder()
                    .name(getRouteName(menu))
                    .path(getRouterPath(menu, parent))
                    .pathParams(menu.getPathParams())
                    .hidden("1".equals(menu.getVisible()))
                    .component(getComponent(menu))
                    .meta(meta)
                    .build();
            router.setChildren(getChildrenRouterVo(menu.getMenuId(), menuMap, router));
            if (null != router.getChildren() && router.getChildren().size() > 0
                    && MenuEnum.DIRECTORY.getCode().equals(menu.getMenuType())) {
                menu.setNoRedirect(Boolean.TRUE);
                router.setMeta(meta);
                router.setAlwaysShow(Boolean.TRUE);
            } else if (isMenuFrame(menu)) {
                List<RouterVo> childrenList = new ArrayList<>();
                RouterVo children = RouterVo.builder()
                        .pathParams(menu.getPathParams())
                        .path(menu.getPath())
                        .component(menu.getComponent())
                        .name(StringUtils.capitalize(menu.getMenuName()))
                        .meta(meta)
                        .build();
                childrenList.add(children);
                router.setChildren(childrenList);
            }
            result.add(router);
        }
        if (result.isEmpty()) {
            return null;
        }
        return result;
    }

    /**
     * 获取到路径名称
     *
     * @param menu 菜单对象
     * @return 路由名称
     */
    private static String getRouteName(Menu menu) {
        String routerName = StringUtils.capitalize(menu.getPath());
        if (isMenuFrame(menu)) {
            routerName = null;
        }
        return routerName;
    }


    /**
     * 是否是一级菜单
     *
     * @param menu 菜单对象
     * @return 正确性
     */
    private static boolean isMenuFrame(Menu menu) {
        return menu.getParentId().equals(0L) && MenuEnum.MENU.getCode().equals(menu.getMenuType()) && !menu.getIsFrame();
    }

    /**
     * 获取前端组件
     *
     * @param menu 菜单对象
     * @return 组件
     */
    private static String getComponent(Menu menu) {
        String component = MenuEnum.LAYOUT.getInfo();
        if (MenuEnum.DIRECTORY.getCode().equals(menu.getMenuType())) {
            if (menu.getParentId().equals(0L)) {
                return component;
            } else {
                return MenuEnum.PARENT_VIEW.getInfo();
            }
        }
        if (!StrUtil.isEmpty(menu.getComponent()) && !isMenuFrame(menu)) {
            component = menu.getComponent();
        }
        return component;
    }

    /**
     * 获取路由
     *
     * @param menu   菜单对象
     * @param parent 父级路由
     * @return 返回路由path
     */
    public static String getRouterPath(Menu menu, RouterVo parent) {
        String routerPath = menu.getPath();
        // 非外链并且是一级目录（类型为目录）
        if (0 == menu.getParentId().intValue() && MenuEnum.DIRECTORY.getCode().equals(menu.getMenuType())
                && !menu.getIsFrame()) {
            routerPath = "/" + menu.getPath();
        }
        // 非外链并且是一级目录（类型为菜单）
        else if (isMenuFrame(menu)) {
            routerPath = "/";
        } else if (MenuEnum.MENU.getCode().equals(menu.getMenuType()) || MenuEnum.DIRECTORY.getCode().equals(menu.getMenuType())) {
            routerPath = parent.getPath() + "/" + menu.getPath();

        }
        return routerPath;
    }

}
