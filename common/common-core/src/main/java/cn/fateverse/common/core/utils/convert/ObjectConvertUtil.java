package cn.fateverse.common.core.utils.convert;

import org.springframework.beans.BeanUtils;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.stream.Collectors;

/**
 * @author Clay
 * @date 2022/11/16
 * 对象之间的转换
 */
public class ObjectConvertUtil {

    private static TreeConfig treeConfig;


    private static Map<String, Field> cacheTargetField;

    private static Map<String,Field> cacheSourceField;

    /**
     * 目标class
     */
    private static Class<?> targetClass;

    private static Class<?> sourceClass;

    /**
     *
     * @param list
     * @param target
     * @param config
     * @return
     * @param <T>
     */
    @SuppressWarnings("unchecked")
    public static <T> List<T> build(List<?> list, Class<T> target, Consumer<TreeConfig> config) {
        if (list.isEmpty()){
            return new ArrayList<>();
        }
        //将目标class对象设置为全局对象
        targetClass = target;
        sourceClass = list.get(0).getClass();
        //初始化config
        treeConfig = new TreeConfig();
        //将目标class对象设置为全局对象
        //提供给实现类对config进行修改
        config.accept(treeConfig);
        List<Object> collect = list.stream().map(ObjectConvertUtil::conversion).collect(Collectors.toList());
        return (List<T>) collect;
    }

    @SuppressWarnings("unchecked")
    private static <T> T conversion(Object object) {
        try {
            Object targetObject = targetClass.newInstance();
            //相同字段名称直接赋值
            if (treeConfig.isCopy()) {
                BeanUtils.copyProperties(object, targetObject);
            }
            //不同字段名进行赋值
            for (Map.Entry<String, String> entry : treeConfig.getMapper().entrySet()) {
                Object value = getSourceValue(object,entry.getValue());
                setTargetValue(targetObject,entry.getKey(),value);
            }
            for (String key : treeConfig.getExclude()) {
                setTargetValue(targetObject,key,null);
            }
            //返回结果
            return (T) targetObject;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private static Object getSourceValue(Object source,String sourceFiled){
        Field field = cacheSourceField.get(sourceFiled);
        if (null == field){
            try {
                field = sourceClass.getDeclaredField(sourceFiled);
            } catch (NoSuchFieldException e) {
                throw new RuntimeException(e);
            }
            cacheSourceField.put(sourceFiled,field);
        }
        field.setAccessible(true);
        return ReflectionUtils.getField(field,source);
    }


    private static void setTargetValue(Object target,String targetFiled,Object value){
        Field field = cacheTargetField.get(targetFiled);
        if (null == field){
            try {
                field = targetClass.getDeclaredField(targetFiled);
            } catch (NoSuchFieldException e) {
                throw new RuntimeException(e);
            }
            cacheTargetField.put(targetFiled,field);
        }
        field.setAccessible(true);
        ReflectionUtils.setField(field,target,value);
    }


}
