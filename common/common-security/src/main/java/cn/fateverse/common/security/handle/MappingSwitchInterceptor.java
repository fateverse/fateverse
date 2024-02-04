package cn.fateverse.common.security.handle;

import cn.fateverse.common.security.annotation.MappingSwitch;
import cn.fateverse.common.security.entity.MappingSwitchInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.core.env.Environment;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.util.ObjectUtils;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * MappingSwitch注解拦截器
 *
 * @author Clay
 * @date 2024/1/15  18:08
 */
@Slf4j
public class MappingSwitchInterceptor implements HandlerInterceptor {

    @Resource
    private Environment environment;

    @Resource
    private RedisTemplate<String, MappingSwitchInfo> redisTemplate;

    private String applicationName;

    @PostConstruct
    public void init() {
        String applicationName = environment.getProperty("spring.application.name");
        if (ObjectUtils.isEmpty(applicationName)) {
            log.error("applicationName can not be null");
            throw new RuntimeException("applicationName can not be null");
        }
        this.applicationName = applicationName;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //判断当前方法是否为HandlerMethod
        if (handler instanceof HandlerMethod) {
            HandlerMethod handlerMethod = (HandlerMethod) handler;
            //判断当前方法上是否有MappingSwitch注解
            MappingSwitch method = AnnotationUtils.findAnnotation(handlerMethod.getMethod(), MappingSwitch.class);
            if (method != null) {
                checkMethodState(handlerMethod, Boolean.TRUE);
            }
            //判断Controller类上是否有MappingSwitch注解
            MappingSwitch controller = AnnotationUtils.findAnnotation(handlerMethod.getBeanType(), MappingSwitch.class);
            if (controller != null) {
                checkMethodState(handlerMethod, Boolean.FALSE);
            }
        }
        return HandlerInterceptor.super.preHandle(request, response, handler);
    }

    /**
     * 检查方法的装填
     *
     * @param handlerMethod 方法对象
     * @param isMethod      是否为方法, true为方法注解,false为Controller类注解
     */
    private void checkMethodState(HandlerMethod handlerMethod, Boolean isMethod) {
        MappingSwitchInfo mappingSwitchInfo = redisTemplate.opsForValue().get(MappingSwitchInfo.getKey(applicationName, handlerMethod, isMethod));
        if (mappingSwitchInfo != null && !mappingSwitchInfo.getState()) {
            throw new RuntimeException("当前接口关闭,请稍后再试");
        }
    }

}
