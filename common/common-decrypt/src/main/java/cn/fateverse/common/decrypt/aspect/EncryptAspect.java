package cn.fateverse.common.decrypt.aspect;

import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.decrypt.annotation.Encrypt;
import cn.fateverse.common.decrypt.annotation.EncryptField;
import cn.fateverse.common.decrypt.service.EncryptService;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Slf4j
@Aspect
public class EncryptAspect {

    protected static String BASE_PACKAGE;


    static {
        String typeName = EncryptAspect.class.getTypeName();
        int fastIndex = typeName.indexOf(".");
        BASE_PACKAGE = typeName.substring(0, typeName.indexOf(".", fastIndex + 1));
    }

    private final EncryptService encryptService;

    public EncryptAspect(EncryptService encryptService) {
        this.encryptService = encryptService;
    }


    @Around("@annotation(cn.fateverse.common.decrypt.annotation.Encrypt)")
    public Object decryptField(ProceedingJoinPoint point) throws Throwable {
        MethodSignature signature = (MethodSignature) point.getSignature();
        //获取方法
        Method method = signature.getMethod();
        Encrypt encrypt = method.getAnnotation(Encrypt.class);
        if (encrypt == null) {
            return point.proceed();
        }
        //获取请求参数
        Object[] args = point.getArgs();
        if (Encrypt.Position.ALL.equals(encrypt.value()) || Encrypt.Position.IN.equals(encrypt.value())) {
            decryptParams(args, point, method);
        }
        //正常执行业务，最后返回的返回值为Result
        Object proceed = point.proceed(args);
        if (Encrypt.Position.ALL.equals(encrypt.value()) || Encrypt.Position.OUT.equals(encrypt.value())) {
            Result<Object> error = encryptResult(proceed);
            if (error != null) {
                return error;
            }
        }
        return proceed;
    }

    private Result<Object> encryptResult(Object proceed) {
        if (proceed instanceof Result) {
            Result<Object> result = (Result<Object>) proceed;
            Object data = result.getData();
            if (null != data) {
                try {
                    encrypt(data);
                } catch (Exception e) {
                    log.error("加密异常", e);
                    return Result.error("加密异常!");
                }
            }
            result.setData(data);
        } else {
            try {
                encrypt(proceed);
            } catch (Exception e) {
                log.error("加密异常", e);
                return Result.error("加密异常!");
            }
        }
        return null;
    }

    private void decryptParams(Object[] args, ProceedingJoinPoint point, Method method) throws Exception {
        //获取方法参数 Parameter对象集 参数修饰符、参数名、注解及注解类型
        Parameter[] parameters = method.getParameters();
        for (int i = 0; i < parameters.length; i++) {
            Parameter parameter = parameters[i];
            //获取参数注解
            EncryptField encryptField = parameter.getAnnotation(EncryptField.class);
            Object arg = args[i];
            if (null != encryptField) {
                if (arg instanceof String) {
                    String decrypt = encryptService.decrypt((String) arg);
                    args[i] = decrypt;
                } else if (arg instanceof List) {
                    try {
                        List<String> list = (List<String>) arg;
                        list.replaceAll(encryptService::decrypt);
                        args[i] = list;
                    } catch (Exception e) {
                        throw new CustomException("接受参数类型错误,请使用String类型的泛型参数");
                    }
                }
            } else if (parameter.getType().getName().startsWith(BASE_PACKAGE)) {  //返回一个类对象，该类对象标识此参数对象表示的参数的声明类型
                decrypt(arg);
            }
        }
    }


    private void encrypt(Object data) throws Exception {
        if (data == null) {
            return;
        }
        Class<?> argClass = data.getClass();
        List<Field> fieldList = new ArrayList<>();
        if (argClass.getTypeName().startsWith(BASE_PACKAGE)) {
            getFields(argClass, fieldList);
            for (Field field : fieldList) {
                EncryptField encryptField = field.getAnnotation(EncryptField.class);
                field.setAccessible(true);
                Object value = ReflectionUtils.getField(field, data);
                if (null == value) {
                    continue;
                }
                if (null != encryptField && value instanceof String) {
                    String decrypt = encryptService.encrypt((String) value);
                    ReflectionUtils.setField(field, data, decrypt);
                } else if (field.getType().getName().startsWith(BASE_PACKAGE)) {
                    if (!value.getClass().isEnum()) {
                        encrypt(value);
                    }
                } else if (value instanceof Collection) {
                    Collection<Object> collection = (Collection<Object>) value;
                    for (Object item : collection) {
                        encrypt(item);
                    }
                }
            }
        } else if (data instanceof Collection) {
            Collection<Object> collection = (Collection<Object>) data;
            for (Object item : collection) {
                encrypt(item);
            }
        }
    }


    private void decrypt(Object arg) throws Exception {
        Class<?> argClass = arg.getClass();
        List<Field> fieldList = new ArrayList<>();
        getFields(argClass, fieldList);
        for (Field field : fieldList) {
            EncryptField encryptField = field.getAnnotation(EncryptField.class);
            field.setAccessible(true);
            Object value = ReflectionUtils.getField(field, arg);
            if (null == value) {
                continue;
            }
            if (null != encryptField && value instanceof String) {
                String decrypt = encryptService.decrypt((String) value);
                ReflectionUtils.setField(field, arg, decrypt);
            } else if (field.getType().getName().startsWith(BASE_PACKAGE)) {
                if (!value.getClass().isEnum()) {
                    decrypt(value);
                }
            }
        }
    }


    private void getFields(Class<?> argClass, List<Field> fieldList) {
        if (argClass.getTypeName().startsWith(BASE_PACKAGE)) {
            Field[] fields = argClass.getDeclaredFields();
            for (Field field : fields) {
                EncryptField encryptField = field.getAnnotation(EncryptField.class);
                if (null != encryptField) {
                    fieldList.add(field);
                }
            }
            getFields(argClass.getSuperclass(), fieldList);
        }
    }


}
