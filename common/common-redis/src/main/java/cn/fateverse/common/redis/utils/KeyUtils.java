package cn.fateverse.common.redis.utils;

import com.alibaba.fastjson2.JSON;
import org.springframework.expression.EvaluationContext;
import org.springframework.util.DigestUtils;
import org.springframework.util.ObjectUtils;

import java.lang.reflect.Field;
import java.util.*;

/**
 * @author Clay
 * @date 2023-06-05
 */
public class KeyUtils {


    public static String getParametersKey(Object[] args, String[] keys, String[] ignoreKeys, int[] argsIndex, String separator, EvaluationContext context) {
        StringBuilder parametersBuffer = new StringBuilder();
        // 优先判断是否设置防重字段，因keys试数组，取值时是按照顺序排列的，这里不需要重新排序
        if (!ObjectUtils.isEmpty(keys)) {
            Object[] argsForKey = ExpressionUtils.getExpressionValue(context, keys);
            for (Object arg : argsForKey) {
                parametersBuffer.append(separator).append(String.valueOf(arg));
            }
        }
        // 如果没有设置防重的字段，那么需要把所有的字段和值作为key，因通过反射获取字段时，顺序时不确定的，这里取出来之后需要进行排序
        else {
            // 只有当keys为空时，ignoreKeys和argsIndex生效
            if (!ObjectUtils.isEmpty(argsIndex)) {
                for (int index : argsIndex) {
                    parametersBuffer.append(separator).append(getKeyAndValueJsonStr(args[index], ignoreKeys));
                }
            } else {
                for (Object obj : args) {
                    parametersBuffer.append(separator).append(getKeyAndValueJsonStr(obj, ignoreKeys));
                }
            }
        }
        // 将请求参数取md5值作为key的一部分
        return DigestUtils.md5DigestAsHex(parametersBuffer.toString().getBytes());
    }


    /**
     * 将字段转换为json字符串
     *
     * @param target
     * @return
     */
    public static String getKeyAndValueJsonStr(Object target, String[] ignoreKeys) {
        //返回对象
        Map<String, Object> map = new HashMap<>(4);
        //需要忽略的Set集合
        Set<String> ignoreKeysSet = new HashSet<>();
        if (null != ignoreKeys) {
            ignoreKeysSet = new HashSet<>(Arrays.asList(ignoreKeys));
        }
        //获取对象的class
        Class<?> targetClass = target.getClass();
        //遍历所有的字段
        for (Field field : targetClass.getDeclaredFields()) {
            //获取字段名称
            String fieldName = field.getName();
            //判断当前字段是否在忽略字段集合中,如果不在则添加到result中
            if (!ignoreKeysSet.contains(fieldName)) {
                //设置当前字段属性是可以访问的
                field.setAccessible(true);
                Object val;
                try {
                    //获取到数据
                    val = field.get(target);
                } catch (IllegalAccessException e) {
                    throw new RuntimeException("您的操作太频繁，请稍后再试", e);
                }
                //添加到返回类型中
                map.put(fieldName, val);
            }
        }
        Map<String, Object> sortMap = sortMapByKey(map);
        return JSON.toJSONString(sortMap);
    }


    private static Map<String, Object> sortMapByKey(Map<String, Object> map) {
        if (map == null || map.isEmpty()) {
            return null;
        }
        Map<String, Object> sortMap = new TreeMap<>(String::compareTo);
        sortMap.putAll(map);
        return sortMap;
    }
}
