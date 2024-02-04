package cn.fateverse.common.core.utils;

import cn.fateverse.common.core.annotaion.AutoTime;
import cn.fateverse.common.core.annotaion.AutoUser;
import cn.fateverse.common.core.constant.UserConstants;
import cn.fateverse.common.core.enums.AutoUserEnum;
import cn.fateverse.common.core.enums.MethodEnum;
import cn.fateverse.common.core.exception.CustomException;
import com.alibaba.fastjson2.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Set;

/**
 * @author Clay
 * @date 2023-05-25
 */
public class AutoSetValueUtils {

    private static final Logger log = LoggerFactory.getLogger(AutoSetValueUtils.class);

    public static final String LONG_TYPE = "java.lang.Long";
    public static final String OBJECT_TYPE = "java.lang.Object";
    public static final String STRING_TYPE = "java.lang.String";
    public static String BASE_PACKAGE;


    static {
        BASE_PACKAGE = getBasePackage(AutoSetValueUtils.class);
    }

    public static String getBasePackage(Class<?> clazz) {
        String typeName = clazz.getTypeName();
        int fastIndex = typeName.indexOf(".");
        return typeName.substring(0, typeName.indexOf(".", fastIndex + 1));
    }


    /**
     * 自动设置userID
     *
     * @param parameter  参数
     * @param methodEnum sql方法
     * @param field      字段
     */
    public static void autoUser(Object parameter, MethodEnum methodEnum, Field field) {
        //获取到设置用户id的注解
        AutoUser autoUser = field.getAnnotation(AutoUser.class);
        if (null != autoUser && autoUser.method() == methodEnum) {
            SecurityContext context = SecurityContextHolder.getContext();
            if (context == null) {
                return;
            }
            Object principal = context.getAuthentication().getPrincipal();
            if (null == principal || UserConstants.ANONYMOUS_USER.equals(principal)) {
                return;
            }
            JSONObject user = ReflectUserUtils.getUser(principal);
            AutoUserEnum value = autoUser.value();
            Class<?> type = field.getType();
            Object object = null;
            String typeName = type.getTypeName();
            if (value == AutoUserEnum.USER_ID) {
                //设置用户id
                long userId = user.getLongValue("userId");
                switch (typeName) {
                    case OBJECT_TYPE:
                    case LONG_TYPE:
                        object = userId;
                        break;
                    case STRING_TYPE:
                        object = Long.toString(userId);
                        break;
                    default:
                        break;
                }
            } else if (value == AutoUserEnum.USER_NAME || value == AutoUserEnum.NICK_NAME) {
                object = value == AutoUserEnum.USER_NAME ? user.getString("userName") : user.getString("nickName");
                if (!(OBJECT_TYPE.equals(typeName) || STRING_TYPE.equals(typeName))) {
                    throw new CustomException("数据类型不配配,Field字段类型为" + typeName + "不能放入String类型的数据");
                }
            } else {
                return;
            }
            try {
                field.setAccessible(true);
                field.set(parameter, object);
            } catch (IllegalAccessException e) {
                log.error("字段:{}自动设置参数失败", field.getName());
            }
        }
    }

    /**
     * 自动设置时间
     *
     * @param parameter  参数
     * @param methodEnum sql方法
     * @param field      字段
     */
    public static void autoTime(Object parameter, MethodEnum methodEnum, Field field) {
        //获取到设置时间的注解
        AutoTime autoTime = field.getAnnotation(AutoTime.class);
        if (null != autoTime && autoTime.method() == methodEnum) {
            field.setAccessible(true);
            Class<?> type = field.getType();
            Object time = null;
            try {
                time = type.newInstance();
                field.set(parameter, time);
            } catch (InstantiationException | IllegalAccessException e) {
                log.error("字段:{}自动设置参数失败,参数为:{}", field.getName(), time);
            }
        }
    }

    /**
     * 自动设置userID
     *
     * @param parameter  参数
     * @param methodEnum sql方法
     * @param fields     字段
     */
    public static void autoUserNew(Object parameter, MethodEnum methodEnum, Set<Field> fields) {
        SecurityContext context = SecurityContextHolder.getContext();
        if (context == null) {
            return;
        }
        Authentication authentication = context.getAuthentication();
        if (null == authentication) {
            return;
        }
        Object principal = authentication.getPrincipal();
        if (null == principal || UserConstants.ANONYMOUS_USER.equals(principal)) {
            return;
        }
        JSONObject user = ReflectUserUtils.getUser(principal);
        for (Field field : fields) {
            setUser(methodEnum, user, parameter, field);
        }
    }

    /**
     * 自动设置时间
     *
     * @param parameter  参数
     * @param methodEnum sql方法
     * @param fields     字段
     */
    public static void autoTimeNew(Object parameter, MethodEnum methodEnum, Set<Field> fields) {
        for (Field field : fields) {
            setTime(methodEnum, parameter, field);
        }
    }

    /**
     * 自动设置userID
     *
     * @param list       参数
     * @param methodEnum sql方法
     * @param fields     字段
     */
    public static void autoUserList(List<Object> list, MethodEnum methodEnum, Set<Field> fields) {
        if (fields.isEmpty()) {
            return;
        }
        SecurityContext context = SecurityContextHolder.getContext();
        if (context == null) {
            return;
        }
        Object principal = context.getAuthentication().getPrincipal();
        if (null == principal || UserConstants.ANONYMOUS_USER.equals(principal)) {
            return;
        }
        JSONObject user = ReflectUserUtils.getUser(principal);
        for (Object param : list) {
            for (Field field : fields) {
                setUser(methodEnum, user, param, field);
            }
        }
    }


    /**
     * 设置用户通用函数
     *
     * @param methodEnum 方法类型
     * @param user       用户信息
     * @param param      参数对象
     * @param field      字段对象
     */
    private static void setUser(MethodEnum methodEnum, JSONObject user, Object param, Field field) {
        long userId = user.getLongValue("userId");
        //获取到设置用户id的注解
        AutoUser autoUser = field.getAnnotation(AutoUser.class);
        if (null != autoUser && autoUser.method() == methodEnum) {
            AutoUserEnum value = autoUser.value();
            Class<?> type = field.getType();
            Object object = null;
            String typeName = type.getTypeName();
            if (value == AutoUserEnum.USER_ID) {
                //设置用户id
                if (type == Object.class || type == Long.class) {
                    object = userId;
                } else if (type == String.class) {
                    object = Long.toString(userId);
                }
            } else if (value == AutoUserEnum.USER_NAME || value == AutoUserEnum.NICK_NAME) {
                object = value == AutoUserEnum.USER_NAME ? user.getString("userName") : user.getString("nickName");
                if (!(type == Object.class || type == Long.class)) {
                    throw new CustomException("数据类型不配配,Field字段类型为" + typeName + "不能放入String类型的数据");
                }
            } else {
                return;
            }
            try {
                field.setAccessible(true);
                field.set(param, object);
            } catch (IllegalAccessException e) {
                log.error("字段:{}自动设置参数失败", field.getName());
            }
        }
    }

    /**
     * 自动设置时间
     *
     * @param list       参数
     * @param methodEnum sql方法
     * @param fields     时间
     */
    public static void autoTimeList(List<Object> list, MethodEnum methodEnum, Set<Field> fields) {
        if (fields.isEmpty()) {
            return;
        }
        for (Object param : list) {
            for (Field field : fields) {
                setTime(methodEnum, param, field);
            }
        }
    }

    /**
     * 设置时间
     *
     * @param methodEnum 方法类型
     * @param param      参数对象
     * @param field      字段
     */
    private static void setTime(MethodEnum methodEnum, Object param, Field field) {
        //获取到设置时间的注解
        AutoTime autoTime = field.getAnnotation(AutoTime.class);
        if (null != autoTime && autoTime.method() == methodEnum) {
            field.setAccessible(true);
            Class<?> type = field.getType();
            Object time = null;
            try {
                time = type.newInstance();
                field.set(param, time);
            } catch (InstantiationException | IllegalAccessException e) {
                log.error("字段:{}自动设置参数失败,参数为:{}", field.getName(), time);
            }
        }
    }

}
