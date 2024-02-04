package cn.fateverse.common.core.utils;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;

/**
 * @author Clay
 * @date 2023-05-10
 */
public class ReflectUserUtils {

    /**
     * 从loginUser中获取到用户信息
     *
     * @param loginUser 登录后的用户
     * @return 用户的字段信息
     */
    private static Field getUserField(Object loginUser) {
        Class<?> userClass = loginUser.getClass();
        try {
            return userClass.getDeclaredField("user");
        } catch (NoSuchFieldException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 获取到token 信息
     *
     * @param loginUser 登录后的用户
     * @return token
     */
    public static String getToken(Object loginUser) {
        Class<?> loginUserClass = loginUser.getClass();
        Field token;
        try {
            token = loginUserClass.getDeclaredField("token");
        } catch (NoSuchFieldException e) {
            throw new RuntimeException(e);
        }
        return getValue(loginUser, token).toString();
    }

    /**
     * 获取用户信息
     *
     * @param loginUser 登录后的用户
     * @return 用户信息
     */
    public static JSONObject getUser(Object loginUser) {
        Field userField = getUserField(loginUser);
        Object user = getValue(loginUser, userField);
        return (JSONObject) JSON.toJSON(user);
    }

    /**
     * 获取到用户Id
     *
     * @param loginUser 登录后的用户
     * @return 用户id
     */
    public static String getUserId(Object loginUser) {
        return getFieldValue(loginUser, "userId");
    }

    /**
     * 获取到用户名
     *
     * @param loginUser 登录后的用户
     * @return 用户名
     */
    public static String getUsername(Object loginUser) {
        return getFieldValue(loginUser, "userName");
    }

    /**
     * 获取到用户别名
     *
     * @param loginUser 登录后的用户
     * @return 用户别名
     */
    public static String getNickname(Object loginUser) {
        return getFieldValue(loginUser, "nickName");
    }

    /**
     * 获取到值
     *
     * @param user 登录后的用户
     * @param field     字段
     * @return 值
     */
    private static Object getValue(Object user, Field field) {
        field.setAccessible(true);
        return ReflectionUtils.getField(field, user);
    }

    /**
     * 通过字段名获取到值
     *
     * @param loginUser 登录后的用户
     * @param fieldName 字段名
     * @return 值
     */
    private static String getFieldValue(Object loginUser, String fieldName) {
        Field userField = getUserField(loginUser);
        Class<?> userClass = userField.getType().getSuperclass();
        Object user = getValue(loginUser, userField);
        Field field = null;
        try {
            field = userClass.getDeclaredField(fieldName);
        } catch (NoSuchFieldException e) {
            throw new RuntimeException(e);
        }
        return getValue(user, field).toString();
    }


}
