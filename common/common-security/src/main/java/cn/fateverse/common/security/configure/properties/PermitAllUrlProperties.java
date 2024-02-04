package cn.fateverse.common.security.configure.properties;

import cn.fateverse.common.security.annotation.Anonymity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.core.env.Environment;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.condition.PathPatternsRequestCondition;
import org.springframework.web.servlet.mvc.condition.PatternsRequestCondition;
import org.springframework.web.servlet.mvc.condition.RequestCondition;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.*;

/**
 * @author Clay
 * @date 2022/10/29
 */
@Slf4j
@ConfigurationProperties(prefix = "security.auth.ignore")
public class PermitAllUrlProperties implements InitializingBean, ApplicationContextAware {

    private ApplicationContext applicationContext;

    private static final String PATTERN = "\\{(.*?)\\}";

    private static final String[] DEFAULT_IGNORE_URLS = new String[]{"/actuator/**", "/error", "/v3/api-docs", "/login", "/captchaImage"};

    private final Set<String> urls = new HashSet<>();

    private String mvcPath = "";

    @Override
    public void afterPropertiesSet() {
        urls.addAll(Arrays.asList(DEFAULT_IGNORE_URLS));
        RequestMappingHandlerMapping mapping = (RequestMappingHandlerMapping) applicationContext.getBean("requestMappingHandlerMapping");
        Map<RequestMappingInfo, HandlerMethod> map = mapping.getHandlerMethods();

        map.keySet().forEach(info -> {
            HandlerMethod handlerMethod = map.get(info);
            // 获取方法上边的注解 替代path variable 为 *
            Anonymity method = AnnotationUtils.findAnnotation(handlerMethod.getMethod(), Anonymity.class);
            if (method != null) {
                /**
                 * todo 加入swagger后 info.getPathPatternsCondition()获取为null,
                 *  但是getPatternsCondition()获取正常,所以替换获取数据的位置,
                 *  同时替换掉下方的getPatternValues()方法为getPatterns()方法
                 */
                PatternsRequestCondition patternsCondition = info.getPatternsCondition();
                if (patternsCondition != null) {
                    patternsCondition.getPatterns().forEach(url -> urls.add(mvcPath + url.replaceAll(PATTERN, "*")));
                }
                PathPatternsRequestCondition pathPatternsCondition = info.getPathPatternsCondition();
                if (pathPatternsCondition != null) {
                    pathPatternsCondition.getPatternValues().forEach(url -> urls.add(mvcPath + url.replaceAll(PATTERN, "*")));
                }
            }
            //Optional.ofNullable(method).ifPresent(inner -> Objects.requireNonNull(info.getPathPatternsCondition())
            //        .getPatternValues().forEach(url -> urls.add(url.replaceAll(PATTERN, "*"))));
            // 获取类上边的注解, 替代path variable 为 *
            Anonymity controller = AnnotationUtils.findAnnotation(handlerMethod.getBeanType(), Anonymity.class);
            if (controller != null) {
                RequestMapping requestMapping = AnnotationUtils.findAnnotation(handlerMethod.getBeanType(), RequestMapping.class);
                if (requestMapping != null) {
                    String[] value = requestMapping.value();
                    for (String path : value) {
                        urls.add(mvcPath + path + "/**");
                    }
                }
            }
        });
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
        Environment environment = applicationContext.getEnvironment();
        String path = environment.getProperty("spring.mvc.servlet.path");
        if (!ObjectUtils.isEmpty(path) && !"/".equals(path)) {
            mvcPath = path;
        }
    }

    public String[] getUrls() {
        return urls.toArray(new String[0]);
    }

    public void setUrls(List<String> urls) {
        this.urls.addAll(urls);
    }
}
