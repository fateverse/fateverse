package cn.fateverse.common.log.service;

import cn.fateverse.common.core.enums.ResultEnum;
import cn.fateverse.common.core.exception.BaseException;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.log.config.OperationProperties;
import cn.fateverse.common.log.enums.BusinessState;
import cn.fateverse.log.dubbo.DubboLogService;
import cn.fateverse.log.entity.OperationLog;
import com.alibaba.fastjson2.JSON;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.dubbo.config.annotation.DubboReference;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Async;
import org.springframework.util.ObjectUtils;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;


/**
 * @author Clay
 * @date 2023-08-03
 */
@Slf4j
public class OperationService {

    private final ScheduledExecutorService service = new ScheduledThreadPoolExecutor(1);

    @DubboReference
    private DubboLogService logService;


    private final String applicationName;

    private final OperationProperties properties;


    private final List<OperationLog> operationLogListCache;

    public OperationService(OperationProperties properties, Environment environment) {
        this.properties = properties;
        this.operationLogListCache = new ArrayList<>(properties.getCacheSize());
        String applicationName = environment.getProperty("spring.application.name");
        if (ObjectUtils.isEmpty(applicationName)) {
            log.error("applicationName can not be null");
            throw new RuntimeException("applicationName can not be null");
        }
        this.applicationName = applicationName;
    }


    @PostConstruct
    public void init() {
        service.scheduleAtFixedRate(() -> {
            synchronized (operationLogListCache) {
                if (!operationLogListCache.isEmpty()) {
                    logService.batchSaveLog(operationLogListCache);
                    operationLogListCache.clear();
                }
            }
        }, 1, 1, TimeUnit.MINUTES);
    }


    @Async
    public void asyncExecute(OperationLog operationLog, Object jsonResult, Throwable e, Long time) {
        operationLog.setState(BusinessState.SUCCESS.ordinal());
        operationLog.setApplicationName(applicationName);
        // 返回参数
        if (jsonResult instanceof Result) {
            Result<Object> result = (Result<Object>) jsonResult;
            operationLog.setJsonResult(JSON.toJSONString(jsonResult));
            if (result.getCode() != ResultEnum.SUCCESS.code) {
                operationLog.setState(1);
            }
            operationLog.setJsonResult(JSON.toJSONString(result));
        } else {
            operationLog.setState(1);
            operationLog.setJsonResult(JSON.toJSONString(jsonResult));
        }
        if (null != e) {
            operationLog.setState(BusinessState.FAIL.ordinal());
            if (!(e instanceof BaseException)) {
                //将错误栈打印到错误信息中
                String trace = ExceptionUtils.getStackTrace(e);
                if (!ObjectUtils.isEmpty(trace)) {
                    operationLog.setErrorStackTrace(trace);
                }
            }
            operationLog.setErrorMsg(e.getMessage());
        }
        if (null != time) {
            operationLog.setConsumeTime(System.currentTimeMillis() - time);
        }
        operationLog.setOperTime(new Date());
        saveLog(operationLog);
    }

    /**
     * 保存日志,先存入到缓存之中
     *
     * @param operationLog 操作日志
     */
    private void saveLog(OperationLog operationLog) {
        synchronized (operationLogListCache) {
            operationLogListCache.add(operationLog);
            if (operationLogListCache.size() >= properties.getCacheSize()) {
                logService.batchSaveLog(operationLogListCache);
                operationLogListCache.clear();
            }
        }
    }


}
