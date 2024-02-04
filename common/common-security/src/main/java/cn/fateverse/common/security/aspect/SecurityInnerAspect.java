package cn.fateverse.common.security.aspect;

import cn.fateverse.common.security.annotation.Anonymity;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.security.access.AccessDeniedException;


/**
 * @author Clay
 * @date 2022/10/29
 */
@Slf4j
@Aspect
public class SecurityInnerAspect implements Ordered {

    @SneakyThrows
    @Around("@within(anonymity) || @annotation(anonymity)")
    public Object around(ProceedingJoinPoint point, Anonymity anonymity) {
        // 实际注入的inner实体由表达式后一个注解决定，即是方法上的@Inner注解实体，若方法上无@Inner注解，则获取类上的
        if (anonymity == null) {
            Class<?> clazz = point.getTarget().getClass();
            anonymity = AnnotationUtils.findAnnotation(clazz, Anonymity.class);
        }
        if (!anonymity.value()) {
            log.warn("访问接口 {} 没有权限", point.getSignature().getName());
            throw new AccessDeniedException("Access is denied");
        }
        return point.proceed();
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 1;
    }

}

