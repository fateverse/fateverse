package cn.fateverse.common.core.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.annotation.Lazy;

/**
 * Spring 事件发布工具类
 * @author Clay
 * @date 2022/11/1
 */
@Slf4j
@Lazy(false)
public class SpringContextHolder implements ApplicationContextAware, DisposableBean {

    private static ApplicationContext applicationContext = null;


    /**
     * 从applicationContext中获取到Bean,并转换成为requiredType对应的类型
     */
    public static <T> T getBean(Class<T> requiredType){
        return applicationContext.getBean(requiredType);
    }

    /**
     * 从applicationContext中获取Bean,并自动转成对应接受的类型
     */
    public static <T> T getBean(String name){
        return (T) applicationContext.getBean(name);
    }

    /**
     * 发布事件,实现异步执行功能
     * @param event
     */
    public static void publishEvent(ApplicationEvent event){
        if (applicationContext == null){
            return;
        }
        applicationContext.publishEvent(event);
    }


    /**
     *
     * @throws Exception
     */

    public static ApplicationContext getApplicationContext(){
        return applicationContext;
    }

    /**
     * 清除SpringContextHolder中的applicationContext
     */
    public static void clearHolder(){
        //如果是debug环境下,打印清除ApplicationContext的日志
        if (log.isDebugEnabled()){
            log.debug("清除SpringContextHolder中的ApplicationContext:" + applicationContext);
        }
        applicationContext = null;
    }


    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        SpringContextHolder.applicationContext = applicationContext;
    }


    @Override
    public void destroy() throws Exception {
        SpringContextHolder.clearHolder();
    }
}
