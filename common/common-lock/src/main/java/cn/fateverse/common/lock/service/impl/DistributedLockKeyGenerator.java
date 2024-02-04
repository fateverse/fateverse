package cn.fateverse.common.lock.service.impl;

import cn.fateverse.common.lock.annotation.DistributedLockParam;
import cn.fateverse.common.lock.service.LockKeyGenerator;
import cn.hutool.core.util.StrUtil;
import cn.fateverse.common.lock.annotation.DistributedLock;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.util.ReflectionUtils;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;

/**
 * @author Clay
 * @date 2023-05-10
 */
@Slf4j
public class DistributedLockKeyGenerator implements LockKeyGenerator {

    @Override
    public String getLockKey(ProceedingJoinPoint point, DistributedLock lock) {
        MethodSignature signature = (MethodSignature)point.getSignature();
        //获取请求参数
        Object[] args = point.getArgs();
        //获取方法
        Method method = signature.getMethod();
        //获取方法参数
        Parameter[] parameters = method.getParameters();
        //锁
        StringBuilder lockBuilder = new StringBuilder();
        //默认解析方法里面带 CacheParam 注解的属性,如果没有尝试着解析实体对象中的
        for (int i = 0; i < parameters.length; i++) {
            Parameter parameter = parameters[i];
            DistributedLockParam annotation = parameter.getAnnotation(DistributedLockParam.class);
            if (null == annotation){
                continue;
            }
            lockBuilder.append(lock.delimiter()).append(args[i]);
        }
        //如果获取到参数为空,则检查对象中是否存在当前注解
        if (StrUtil.isEmpty(lockBuilder.toString())){
            Annotation[][] parameterAnnotations = method.getParameterAnnotations();
            for (int i = 0; i < parameterAnnotations.length; i++) {
                Object arg = args[i];
                Field[] fields = arg.getClass().getDeclaredFields();
                for (Field field : fields) {
                    DistributedLockParam annotation = field.getAnnotation(DistributedLockParam.class);
                    if (null == annotation){
                        continue;
                    }
                    field.setAccessible(true);
                    lockBuilder.append(lock.delimiter()).append(ReflectionUtils.getField(field,arg));
                }
            }
        }
        return lock.prefix() + lock;
    }
}
