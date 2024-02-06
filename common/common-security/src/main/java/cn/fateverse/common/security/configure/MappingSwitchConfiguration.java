package cn.fateverse.common.security.configure;

import cn.fateverse.common.security.annotation.MappingSwitch;
import cn.fateverse.common.security.entity.MappingSwitchInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.core.env.Environment;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.condition.PatternsRequestCondition;
import org.springframework.web.servlet.mvc.condition.RequestMethodsRequestCondition;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import javax.annotation.Resource;
import java.util.*;
import java.util.stream.Collectors;

/**
 * MappingSwitch开关处理类
 *
 * @author Clay
 * @date 2024/1/15  17:20
 */
@Slf4j
public class MappingSwitchConfiguration implements InitializingBean, ApplicationContextAware {

    private ApplicationContext applicationContext;

    private String applicationName = "";

    @Qualifier("fateverseExecutor")
    @Resource
    private ThreadPoolTaskExecutor taskExecuteExecutor;

    @Resource
    private RedisTemplate<String, MappingSwitchInfo> redisTemplate;

    @Override
    public void afterPropertiesSet() {
        taskExecuteExecutor.submit(() -> {
            RequestMappingHandlerMapping mapping = (RequestMappingHandlerMapping) applicationContext.getBean("requestMappingHandlerMapping");
            Map<RequestMappingInfo, HandlerMethod> map = mapping.getHandlerMethods();
            Map<String, MappingSwitchInfo> mappingSwitchInfoMap = new HashMap<>();
            map.forEach((info, handlerMethod) -> {
                //判断方法上是否存在注解
                MappingSwitch method = AnnotationUtils.findAnnotation(handlerMethod.getMethod(), MappingSwitch.class);
                if (method != null) {
                    MappingSwitchInfo mappingSwitchInfo = new MappingSwitchInfo();
                    mappingSwitchInfo.setClassName(handlerMethod.getBeanType().getName());
                    mappingSwitchInfo.setMethodName(handlerMethod.getMethod().getName());
                    mappingSwitchInfo.setApplicationName(applicationName);
                    mappingSwitchInfo.setState(Boolean.TRUE);
                    mappingSwitchInfo.setDescription(method.value());
                    //获取到uri
                    PatternsRequestCondition patternsCondition = info.getPatternsCondition();
                    if (patternsCondition != null) {
                        Set<String> uris = patternsCondition.getPatterns();
                        mappingSwitchInfo.setUris(uris);
                    }
                    //获取到请求类型
                    RequestMethodsRequestCondition infoMethodsCondition = info.getMethodsCondition();
                    Set<RequestMethod> methods = infoMethodsCondition.getMethods();
                    if (!methods.isEmpty()) {
                        Set<String> methodSet = methods.stream().map(Enum::toString).collect(Collectors.toSet());
                        mappingSwitchInfo.setHttpMethods(methodSet);
                    }
                    //获取到当前的key
                    String key = MappingSwitchInfo.getKey(applicationName, handlerMethod, Boolean.TRUE);
                    //初始化
                    initRedisCache(key, mappingSwitchInfo);
                    mappingSwitchInfo.setType(MappingSwitchInfo.MappingSwitchType.METHOD);
                    //添加到临时缓存中
                    mappingSwitchInfoMap.put(key, mappingSwitchInfo);
                }
                //判断类上是否存在注解
                MappingSwitch controller = AnnotationUtils.findAnnotation(handlerMethod.getBeanType(), MappingSwitch.class);
                if (controller != null) {
                    //获取到key
                    String key = MappingSwitchInfo.getKey(applicationName, handlerMethod, Boolean.FALSE);
                    if (!mappingSwitchInfoMap.containsKey(key)) {
                        // 创建存储对象
                        MappingSwitchInfo mappingSwitchInfo = new MappingSwitchInfo();
                        mappingSwitchInfo.setClassName(handlerMethod.getBeanType().getName());
                        mappingSwitchInfo.setApplicationName(applicationName);
                        mappingSwitchInfo.setState(Boolean.TRUE);
                        mappingSwitchInfo.setDescription(controller.value());
                        //获取到RequestMapping,以获取到当前Controller的请求路径
                        RequestMapping requestMapping = AnnotationUtils.findAnnotation(handlerMethod.getBeanType(), RequestMapping.class);
                        if (requestMapping != null) {
                            String[] value = requestMapping.value();
                            Set<String> uris = new HashSet<>();
                            Collections.addAll(uris, value);
                            mappingSwitchInfo.setUris(uris);
                        }
                        //初始化对象
                        initRedisCache(key, mappingSwitchInfo);
                        mappingSwitchInfo.setType(MappingSwitchInfo.MappingSwitchType.CLASS);
                        //将对象添加到临时缓存
                        mappingSwitchInfoMap.put(key, mappingSwitchInfo);
                    }
                }
            });
            if (!mappingSwitchInfoMap.isEmpty()) {
                Set<String> keys = new HashSet<>();
                try (Cursor<String> cursor = redisTemplate.scan(ScanOptions.scanOptions()
                        .match(MappingSwitchInfo.MappingSwitchConstant.MAPPING_SWITCH + applicationName + "*")
                        .build())) {
                    while (cursor.hasNext()) {
                        keys.add(cursor.next());
                    }
                }
                //先删除当前应用名称下的数据
                redisTemplate.delete(keys);
                //重新新增
                redisTemplate.opsForValue().multiSet(mappingSwitchInfoMap);
            }
        });
    }

    /**
     * 初始化缓存对象
     *
     * @param key  redis key
     * @param info 存储对象
     */
    private void initRedisCache(String key, MappingSwitchInfo info) {
        //获取redis中当前的key
        MappingSwitchInfo cacheInfo = redisTemplate.opsForValue().get(key);
        //如果redis中的状态为false,则不能更改redis中的状态
        if (cacheInfo != null && !cacheInfo.getState()) {
            info.setState(Boolean.FALSE);
        }
        info.setKey(key);
    }


    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
        Environment environment = applicationContext.getEnvironment();
        String applicationName = environment.getProperty("spring.application.name");
        if (ObjectUtils.isEmpty(applicationName)) {
            log.error("applicationName can not be null");
            throw new RuntimeException("applicationName can not be null");
        }
        this.applicationName = applicationName;
    }

}
