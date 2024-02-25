package cn.fateverse.common.log.aspect;

import cn.fateverse.common.core.utils.HttpServletUtils;
import cn.fateverse.common.core.utils.IpUtils;
import cn.fateverse.common.log.annotation.Log;
import cn.fateverse.common.log.config.OperationProperties;
import cn.hutool.core.util.StrUtil;
import cn.fateverse.common.core.constant.UserConstants;
import cn.fateverse.common.core.utils.ReflectUserUtils;
import cn.fateverse.common.log.enums.LogLeve;
import cn.fateverse.common.log.enums.OperateType;
import cn.fateverse.common.log.service.OperationService;
import cn.fateverse.log.entity.OperationLog;
import com.alibaba.fastjson2.JSON;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.HandlerMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.Method;
import java.util.Map;

/**
 * @author Clay
 * @date 2022/11/1
 */
@Slf4j
@Aspect
public class LogAspect {

    @Autowired
    private OperationService operationService;

    @Autowired
    private OperationProperties operationProperties;

    private final ThreadLocal<Long> startTime = new ThreadLocal<>();


//    @Before("@within(log) || @annotation(log)")
//    public void before(JoinPoint point, Log log) {
//        startTime.set(System.currentTimeMillis());
//    }

    @Around("@within(log) || @annotation(log)")
    public Object around(ProceedingJoinPoint point, Log log) throws Throwable {
        long startTime = System.currentTimeMillis();
        try {
            Object proceed = point.proceed(point.getArgs());
            HttpServletRequest request = HttpServletUtils.getRequest();
            handleLog(point, proceed, request, null, log, true, startTime);
            return proceed;
        } catch (Throwable e) {
            HttpServletRequest request = HttpServletUtils.getRequest();
            handleLog(point, null, request, e, log, false, startTime);
            throw e;
        }

    }


//    @AfterReturning(pointcut = "@within(log) || @annotation(log)", returning = "jsonResult")
//    public void doAfterReturning(JoinPoint point, Object jsonResult, Log log) {
//        HttpServletRequest request = HttpServletUtils.getRequest();
//        handleLog(point, jsonResult, request, null, log, true, startTime.get());
//        startTime.remove();
//    }


//    @AfterThrowing(pointcut = "@within(log) || @annotation(log)", throwing = "e")
//    public void doAfterThrowing(JoinPoint point, Exception e, Log log) throws Exception {
//        HttpServletRequest request = HttpServletUtils.getRequest();
//        handleLog(point, null, request, e, log, false, startTime.get());
//        startTime.remove();
//    }


    protected Boolean check(Boolean success) {
        if (!operationProperties.getEnabled()) {
            return false;
        }
        if (operationProperties.getLevel().equals(LogLeve.ALL)) {
            return true;
        }
        if (success & operationProperties.getLevel().equals(LogLeve.SUCCESS)) {
            return true;
        }
        return !success & operationProperties.getLevel().equals(LogLeve.ERROR);
    }


    protected void handleLog(JoinPoint point, Object jsonResult, HttpServletRequest request, Throwable e, Log controllerLog, Boolean success, Long time) {
        if (!check(success)) {
            return;
        }
        try {
            controllerLog = chickLog(point, controllerLog);
            OperationLog operationLog = new OperationLog();
            //请求地址
            operationLog.setOperIp(IpUtils.getIpAdder(request));
            operationLog.setOperUrl(request.getRequestURI());
            // 设置请求方式
            operationLog.setRequestMethod(request.getMethod());
            //处理设置注解上的参数
            getControllerMethodDescription(point, controllerLog, operationLog, request);
            // 设置操作人
            setOperName(operationLog);
            // 设置方法名称
            String className = point.getTarget().getClass().getName();
            String methodName = point.getSignature().getName();
            operationLog.setMethod(className + "." + methodName + "()");
            operationService.asyncExecute(operationLog, jsonResult, e, time);
        } catch (Exception exp) {
            // 记录本地异常日志
            log.error("异常信息:{}", exp.getMessage());
            exp.printStackTrace();
        }
    }

    /**
     * 设置操作人
     *
     * @param operationLog
     */
    public void setOperName(OperationLog operationLog) {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (null != principal && !UserConstants.ANONYMOUS_USER.equals(principal)) {
                String userName = ReflectUserUtils.getUsername(principal);
                operationLog.setOperName(userName);
                String userId = ReflectUserUtils.getUserId(principal);
                operationLog.setUserId(Long.valueOf(userId));
            }
        } catch (Exception e) {
            log.info("当前接口不是由登录后的用户触发的!");
            operationLog.setOperatorType(OperateType.OTHER.ordinal());
        }
    }


    /**
     * 获取控制前方法上的描述
     *
     * @param point
     * @param log
     * @param operationLog
     * @param request
     * @throws Exception
     */
    public void getControllerMethodDescription(JoinPoint point, Log log, OperationLog operationLog, HttpServletRequest request) throws Exception {
        //设置action动作
        operationLog.setBusinessType(log.businessType().ordinal());
        //设置标题
        operationLog.setTitle(log.title());
        //设置操作人类型
        operationLog.setOperatorType(log.operatorType().ordinal());
        // 是否需要保存request,参数和值
        if (log.isSaveRequestData()) {
            // 获取参数的信息,传入到数据库中
            setRequestValue(point, operationLog, request);
        }
    }


    /**
     * 获取请求的参数，放到log中
     *
     * @param operationLog 操作日志
     * @param request
     * @throws Exception 异常
     */
    private void setRequestValue(JoinPoint joinPoint, OperationLog operationLog, HttpServletRequest request) throws Exception {
        String requestMethod = operationLog.getRequestMethod();
        if (HttpMethod.PUT.name().equals(requestMethod) || HttpMethod.POST.name().equals(requestMethod)) {
            String params = argsArrayToString(joinPoint.getArgs());
            operationLog.setOperParam(StrUtil.sub(params, 0, 2000));
        } else {
            Map<?, ?> paramsMap = (Map<?, ?>) request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);
            operationLog.setOperParam(StrUtil.sub(paramsMap.toString(), 0, 2000));
        }
    }


    /**
     * 参数拼装
     */
    private String argsArrayToString(Object[] paramsArray) {
        StringBuilder params = new StringBuilder();
        if (paramsArray != null && paramsArray.length > 0) {
            for (Object object : paramsArray) {
                if (!isFilterObject(object)) {
                    Object jsonObj = JSON.toJSON(object);
                    params.append(jsonObj.toString()).append(" ");
                }
            }
        }
        return params.toString().trim();
    }

    /**
     * 判断是否需要过滤的对象。
     *
     * @param o 对象信息。
     * @return 如果是需要过滤的对象，则返回true；否则返回false。
     */
    public boolean isFilterObject(final Object o) {
        return o instanceof MultipartFile || o instanceof HttpServletRequest || o instanceof HttpServletResponse;
    }

    /**
     * 检查Log相关信息
     *
     * @param point
     * @param log
     * @return
     */
    public Log chickLog(JoinPoint point, Log log) {
        if (log == null) {
            MethodSignature signature = (MethodSignature) point.getSignature();
            Method method = signature.getMethod();
            if (method != null) {
                log = method.getAnnotation(Log.class);
            }
        }
        return log;
    }


}
