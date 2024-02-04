package cn.fateverse.common.core.utils;

import cn.fateverse.common.core.exception.CustomException;

import java.util.List;

/**
 * @author Clay
 * @date 2022/12/18
 */
public class ObjectUtils extends org.springframework.util.ObjectUtils {
    /**
     * 检查主键
     * @param pk 主键
     */
    public static void checkPk(Object pk) {
        checkPk(pk, "缺少必要参数!");
    }

    /**
     * 检查主键
     * @param pk 主键
     * @param message 错误提示消息
     */
    public static void checkPk(Object pk, String message) {
        if (pk instanceof Long) {
            LongUtils.checkId((Long) pk, message);
        } else if (pk instanceof String) {
            if (isEmpty(pk)) {
                throw new CustomException(message);
            }
        } else {
            if (null == pk) {
                throw new CustomException(message);
            }
        }
    }

    /**
     * 检查主键list
     * @param pkList 主键list
     */
    public static void checkPkList(List<?> pkList) {
        checkPkList(pkList,"缺少必要参数!");
    }

    /**
     * 检查主键list
     * @param pkList 主键list
     * @param message 错误提示消息
     */
    public static void checkPkList(List<?> pkList, String message) {
        if (isEmpty(pkList)){
            throw new CustomException(message);
        }
    }


}
