package cn.fateverse.admin.service.impl;

import cn.fateverse.admin.dto.MenuDto;
import cn.fateverse.admin.entity.User;
import cn.fateverse.admin.vo.MenuSimpVo;
import cn.fateverse.admin.vo.MenuVo;
import cn.fateverse.admin.vo.OptionMenuVo;
import cn.fateverse.admin.vo.RouterVo;
import cn.fateverse.admin.entity.Menu;
import cn.fateverse.admin.utils.MenuTree;
import cn.fateverse.admin.mapper.MenuMapper;
import cn.fateverse.admin.mapper.RoleMenuMapper;
import cn.fateverse.admin.service.MenuService;
import cn.fateverse.common.core.constant.CacheConstants;
import cn.fateverse.common.core.entity.OptionTree;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.utils.convert.TreeUtil;
import cn.fateverse.common.security.utils.SecurityUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.function.Supplier;
import java.util.stream.Collectors;

/**
 * @author Clay
 * @date 2022/10/30
 */
@Slf4j
@Service
public class MenuServiceImpl implements MenuService {

    private final MenuMapper menuMapper;

    private final RoleMenuMapper roleMenuMapper;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    private final ThreadPoolTaskExecutor executor;

    public MenuServiceImpl(MenuMapper menuMapper,
                           RoleMenuMapper roleMenuMapper,
                           ThreadPoolTaskExecutor executor) {
        this.menuMapper = menuMapper;
        this.roleMenuMapper = roleMenuMapper;
        this.executor = executor;
    }

    @Override
    public Set<String> searchPermsByUserId(Long userId) {
        Set<String> menuSet = menuMapper.selectMenuPermsByUserId(userId);
        return menuSet.stream()
                .filter(menu -> (!"".equals(menu)))
                .collect(Collectors.toSet());
    }

    @Override
    public List<RouterVo> searchRouterByUserId(Long userId) {
        List<Menu> menuList = null;
        if (User.isAdmin(userId)) {
            menuList = menuMapper.selectRouterMenuList();
        } else {
            menuList = menuMapper.selectRouterMenuListByUserId(userId);
        }
        return MenuTree.getTree(menuList);
    }

    @Override
    public List<MenuSimpVo> searchTree(String menuName, String state) {
        List<Menu> menuList = null;
        User user = Objects.requireNonNull(SecurityUtils.getLoginUser()).getUser();
        if (User.isAdmin(user.getUserId())) {
            menuList = menuMapper.selectList(menuName, state, null, false);
        } else {
            menuList = menuMapper.selectListByUserId(user.getUserId(), menuName, state, null, false);
        }
        return TreeUtil.build(menuList, MenuSimpVo.class, (config) -> {
            config.setIdField("menuId");
            config.setSortOrder(true, "orderNum");
        });
    }

    @Override
    public MenuVo searchByMenuId(Long menuId) {
        Menu menu = menuMapper.selectById(menuId);
        MenuVo menuVo = new MenuVo();
        BeanUtils.copyProperties(menu, menuVo);
        return menuVo;
    }


    @Override
    public List<OptionTree> searchTreeOption(Long excludeId) {
        User user = Objects.requireNonNull(SecurityUtils.getLoginUser()).getUser();
        List<Menu> menuList = null;
        if (User.isAdmin(user.getUserId())) {
            menuList = menuMapper.selectList(null, null, excludeId, true);
        } else {
            menuList = menuMapper.selectListByUserId(user.getUserId(), null, null, excludeId, true);
        }
        return TreeUtil.build(menuList, OptionTree.class, (config) -> {
            config.setIdField("menuId");
            config.setOption("menuId", "menuName");
            config.setSortOrder(true, "orderNum");
        });
    }

    @Override
    public OptionMenuVo searchOptionRoleByRoleId(Long roleId) {
        Set<Long> checkedSet = new HashSet<>();
        if (null == roleId || roleId.equals(0L)) {
            checkedSet = menuMapper.selectCheckedMenuIdByRoleId(roleId);
        }
        User user = Objects.requireNonNull(SecurityUtils.getLoginUser()).getUser();
        List<Menu> menuList = null;
        if (User.isAdmin(user.getUserId())) {
            menuList = menuMapper.selectList(null, null, null, true);
        } else {
            menuList = menuMapper.selectListByUserId(user.getUserId(), null, null, null, true);
        }
        return OptionMenuVo.builder()
                .checked(checkedSet)
                .menuOption(TreeUtil.build(menuList, OptionTree.class, (config) -> {
                    config.setIdField("menuId");
                    config.setOption("menuId", "menuName");
                }))
                .build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int save(MenuDto dto) {
        return updateMenuAndCache(() -> {
            Menu menu = initMenuByType(dto);
            menu.setMenuId(null);
            return menuMapper.insert(menu);
        });
    }

    @Override
    public void saveRPC(MenuDto dto) {
        List<Menu> info = menuMapper.selectByPerms(dto.getPerms());
        if (info != null && !info.isEmpty()) {
            dto.setMenuId(info.get(0).getMenuId());
            return;
        }
        updateMenuAndCache(() -> {
            Menu menu = initMenuByType(dto);
            menuMapper.insert(menu);
            dto.setMenuId(menu.getMenuId());
            return null;
        });

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int edit(MenuDto dto) {
        return updateMenuAndCache(() -> {
            Menu menu = initMenuByType(dto);
            return menuMapper.update(menu);
        });
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int removeById(Long menuId) {
        Integer count = menuMapper.selectCountByParentId(menuId);
        if (count > 0) {
            throw new CustomException("当前菜单还有子项,不允许删除");
        }
        return updateMenuAndCache(() -> {
            roleMenuMapper.deleteByMenuId(menuId);
            return menuMapper.deleteById(menuId);
        });

    }

    /**
     * 取消自定义查询的菜单
     *
     * @param menuId 菜单id
     */
    @Override
    public void removeMenu(Long menuId) {
        updateMenuAndCache(() -> {
            roleMenuMapper.deleteByMenuId(menuId);
            menuMapper.deleteById(menuId);
            return null;
        });
    }

    /**
     * 函数式编程异步删除缓存
     *
     * @param supplier 自定义函数方法
     * @param <T>      泛型类
     * @return 处理结果
     */
    public <T> T updateMenuAndCache(Supplier<T> supplier) {
        deleteRouteCache();
        T result = supplier.get();
        asyncDeleteRouteCache();
        return result;
    }

    /**
     * 异步删除route缓存信息
     */
    public void asyncDeleteRouteCache() {
        executor.execute(this::deleteRouteCache);
    }

    /**
     * 删除route缓存信息
     */
    public void deleteRouteCache() {
        Set<String> keys = redisTemplate.keys(CacheConstants.ROUTE_CACHE_KEY + "*");
        if (null != keys && !keys.isEmpty()) {
            redisTemplate.delete(keys);
        }
    }

    /**
     * 根据菜单类型初始化菜单
     *
     * @param dto 菜单dto对象
     * @return 菜单对象
     */
    private Menu initMenuByType(MenuDto dto) {
        Menu menu = new Menu();
        BeanUtils.copyProperties(dto, menu);
        switch (menu.getMenuType()) {
            case "C":
                initDirectory(menu);
                break;
            case "M":
                initMenu(menu);
                break;
            case "B":
                initButton(menu);
                break;
            default:
                break;
        }
        return menu;
    }

    /**
     * 初始化目录
     *
     * @param menu 菜单对象
     */
    private void initDirectory(Menu menu) {
        menu.setComponent(null);
        menu.setPerms(null);
    }

    /**
     * 初始化菜单项
     *
     * @param menu 菜单对象
     */
    private void initMenu(Menu menu) {
    }

    /**
     * 初始化按钮
     *
     * @param menu 菜单对象
     */
    private void initButton(Menu menu) {
        menu.setComponent(null);
        menu.setPath(null);
        menu.setIsFrame(Boolean.FALSE);
        menu.setIsCache(Boolean.TRUE);
        menu.setVisible("0");
        menu.setIcon(null);
    }
}
