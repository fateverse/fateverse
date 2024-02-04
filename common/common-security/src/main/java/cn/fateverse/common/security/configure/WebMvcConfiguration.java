package cn.fateverse.common.security.configure;

import cn.fateverse.common.security.handle.MappingSwitchInterceptor;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * Jackson,处理受Swagger中@EnableWebMvc注解影响
 *
 * @author Clay
 * @date 2023-05-05
 */
@Slf4j
public class WebMvcConfiguration implements WebMvcConfigurer {

    @Resource
    private ObjectMapper objectMapper;

    @Resource
    private MappingSwitchInterceptor mappingSwitchInterceptor;

    /**
     * @EnableWebMvc 使用该注解后，需要手动配置  addInterceptors() 和 addResourceHandlers()
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor() {
                    @Override
                    public boolean preHandle(@NotNull HttpServletRequest request, @NotNull HttpServletResponse response, @NotNull Object handler) throws Exception {
                        return HandlerInterceptor.super.preHandle(request, response, handler);
                    }
                }).addPathPatterns("/**")
                .excludePathPatterns("/v2/**")
                .excludePathPatterns("/v3/**");
        registry.addInterceptor(mappingSwitchInterceptor).addPathPatterns("/**");
    }

    /**
     * 填充全局 objectMapper
     * <a href="https://stackoverflow.com/questions/45734108/spring-boot-not-using-configured-jackson-objectmapper-with-enablewebmvc">...</a>
     *
     * @param converters
     */
    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.stream().filter(p -> p instanceof MappingJackson2HttpMessageConverter)
                .map(p -> (MappingJackson2HttpMessageConverter) p).forEach(p -> p.setObjectMapper(objectMapper));
        WebMvcConfigurer.super.extendMessageConverters(converters);
    }
}
