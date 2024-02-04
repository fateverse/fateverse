package cn.fateverse.common.security.entity;

import lombok.Data;
import org.springframework.web.method.HandlerMethod;

import java.lang.reflect.Method;
import java.util.Set;
import java.util.StringJoiner;

/**
 * MappingSwitch信息封装类
 *
 * @author Clay
 * @date 2024/1/15  17:33
 */
@Data
public class MappingSwitchInfo {

    /**
     * 应用名称
     */
    private String applicationName;

    /**
     * 类名
     */
    private String className;

    /**
     * 方法名称
     */
    private String methodName;

    /**
     * 描述MappingSwitch注解的value可以为空
     */
    private String description;

    /**
     * HandlerMethod中的uri
     */
    private Set<String> uris;

    /**
     * 当前方法请求类型
     */
    private Set<String> httpMethods;

    /**
     * 当前方法的状态,true为正常放行,false为关闭
     */
    private Boolean state;

    public static class MappingSwitchConstant {
        /**
         * redis 的前缀
         */
        public static String MAPPING_SWITCH = "mapping:switch:";
    }

    /**
     * 获取redis key的方法
     * key 生成规则
     * 类注解:    {前缀}:{applicationName}:{className}
     * 方法注解:  {前缀}:{applicationName}:{className}:{methodStr}
     *
     * @param applicationName 应用名称
     * @param handlerMethod   请求方法
     * @param isMethod        是否为方法注解
     * @return key
     */
    public static String getKey(String applicationName, HandlerMethod handlerMethod, Boolean isMethod) {
        String packageName = handlerMethod.getBeanType().getPackage().getName() + ".";
        String name = handlerMethod.getBeanType().getName();
        String className = name.replace(packageName, "");
        String methodStr = "";
        if (isMethod) {
            Method method = handlerMethod.getMethod();
            StringJoiner joiner = new StringJoiner(", ", "(", ")");
            for (Class<?> paramType : method.getParameterTypes()) {
                joiner.add(paramType.getSimpleName());
            }
            methodStr = ":" + method.getName() + joiner;
        }
        return MappingSwitchInfo.MappingSwitchConstant.MAPPING_SWITCH + applicationName + ":" + className + methodStr;
    }
}
