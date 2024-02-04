package cn.fateverse.common.core.utils.convert;

import cn.hutool.core.convert.Convert;
import org.springframework.beans.BeanUtils;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.util.*;
import java.util.function.Consumer;
import java.util.stream.Collectors;

/**
 * @author Clay
 * @date 2022/11/16
 * 树形结构转换递归方式
 */
@SuppressWarnings("unchecked")
public class TreeUtil {
    /**
     * 配置信息
     */
    private static TreeConfig treeConfig;

    private static Map<String, Field> cacheTargetField;

    private static Map<String, Field> cacheSourceField;

    /**
     * 目标class
     */
    private static Class<?> targetClass;

    private static Class<?> sourceClass;

    /**
     * 构建tree结构
     *
     * @param list   需要转换的list
     * @param target 目标class对象
     * @param config 配置项
     * @param <T>    目标对象类型
     * @return
     */
    public static <T> List<T> build(List<?> list, Class<T> target, Consumer<TreeConfig> config) {
        if (list.isEmpty()) {
            return new ArrayList<>();
        }
        //将目标class对象设置为全局对象
        targetClass = target;
        sourceClass = list.get(0).getClass();
        //初始化config
        treeConfig = new TreeConfig();
        //初始化字段缓存
        cacheTargetField = new HashMap<>();
        cacheSourceField = new HashMap<>();
        //提供给实现类对config进行修改
        config.accept(treeConfig);
        //获取到最小的
        Object min = list.stream().min(Comparator.comparing(object -> getParentId(object).toString())).get();
        //获取到最小的父级id
        Object minPid = getParentId(min);
        //将数据通过他们的各自的父id进行分组
        Map<Object, List<Object>> listMap = list.stream().collect(Collectors.groupingBy(TreeUtil::getParentId));
        //最终开始进行tree的构建
        return getChildren(listMap, minPid);
    }

    /**
     * 获取到子节点
     *
     * @param listMap
     * @param parentId
     * @param <T>
     * @return
     */
    private static <T> List<T> getChildren(Map<Object, List<Object>> listMap, Object parentId) {
        //获取到缓存中的list
        List<?> objects = listMap.get(parentId);
        if (chickList(objects)) {
            return null;
        }
        if (treeConfig.getStore()) {
            objects = objects.stream().sorted(Comparator.comparing(item ->
                    Convert.toInt(getSourceValue(item, treeConfig.getStoreField()))
            )).collect(Collectors.toList());
        }
        listMap.remove(parentId);
        //遍历数组,并将对象一一的转换
        List<Object> collect = objects.stream().map(object ->
                conversion(object, listMap)).collect(Collectors.toList());
        return (List<T>) collect;
    }

    /**
     * 对象直接的字段进行转换
     *
     * @param object
     * @param listMap
     * @param <T>
     * @return
     */
    private static <T> T conversion(Object object, Map<Object, List<Object>> listMap) {
        try {
            Object targetObject = targetClass.newInstance();
            //相同字段名称直接赋值
            if (treeConfig.isCopy()) {
                BeanUtils.copyProperties(object, targetObject);
            }
            //不同字段名进行赋值
            for (Map.Entry<String, String> entry : treeConfig.getMapper().entrySet()) {
                Object value = getSourceValue(object, entry.getValue());
                setTargetValue(targetObject, entry.getKey(), value);
            }
            //设置子节点
            Object id = getSourceValue(object, treeConfig.getIdField());
            List<Object> children = getChildren(listMap, id);
            if (!chickList(children)) {
                setTargetValue(targetObject, treeConfig.getChildrenField(), children);
            }
            //设置完毕后,将需要排除的字段进行置空
            for (String key : treeConfig.getExclude()) {
                setTargetValue(targetObject, key, null);
            }
            //返回结果
            return (T) targetObject;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private static Object getSourceValue(Object source, String sourceFiled) {
        Field field = cacheSourceField.get(sourceFiled);
        if (null == field) {
            try {
                field = sourceClass.getDeclaredField(sourceFiled);
                field.setAccessible(true);
            } catch (NoSuchFieldException e) {
                throw new RuntimeException(e);
            }
            cacheSourceField.put(sourceFiled, field);
        }
        return ReflectionUtils.getField(field, source);
    }


    private static void setTargetValue(Object target, String targetFiled, Object value) {
        Field field = cacheTargetField.get(targetFiled);
        if (null == field) {
            try {
                field = targetClass.getDeclaredField(targetFiled);
            } catch (NoSuchFieldException e) {
                throw new RuntimeException(e);
            }
            field.setAccessible(true);
            cacheTargetField.put(targetFiled, field);
        }
        ReflectionUtils.setField(field, target, value);
    }

    /**
     * 检查list是否为空
     *
     * @param objects
     * @return
     */
    private static boolean chickList(List<?> objects) {
        return null == objects || objects.isEmpty();
    }

    /**
     * 获取到父级id
     *
     * @param object
     * @return
     */
    private static Object getParentId(Object object) {
        try {
            return getSourceValue(object, treeConfig.getParentField());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}

