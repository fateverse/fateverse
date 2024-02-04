package cn.fateverse.common.core.utils;

import cn.fateverse.common.core.enums.MenuEnum;

/**
 * @author Clay
 * @date 2022/11/9
 */
public class MenuTypeUtils {

    public static boolean checkMenuTypeLegal(String menuType){
        return MenuEnum.MENU.getInfo().equals(menuType) ||
                MenuEnum.DIRECTORY.getInfo().equals(menuType)||
                MenuEnum.BUTTON.getInfo().equals(menuType);
    }
}
