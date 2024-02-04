package cn.fateverse.common.core.utils;

import cn.fateverse.common.core.enums.StateEnum;

/**
 * @author Clay
 * @date 2022/11/6
 */
public class StateUtils {

    public static boolean checkStateLegal(String state){
        return StateEnum.NORMAL.getCode().equals(state) ||
                StateEnum.DISABLE.getCode().equals(state);
    }
}
