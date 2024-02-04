package cn.fateverse.common.core.utils;

import cn.fateverse.common.core.exception.CustomException;

/**
 * Long工具类
 *
 * @author Clay
 * @date 2022/11/6
 */
public class LongUtils {


    public static boolean isNull(Long num){
        return null == num || 0L == num;
    }

    public static boolean isNotNull(Long num){
        return !isNull(num);
    }

    public static void checkId(Long pk){
        checkId(pk,"缺少必要参数!");
    }

    public static void checkId(Long pk, String message){
        if (isNull(pk)) {
            throw new CustomException(message);
        }
    }



}
