package cn.fateverse.log.dubbo;

import cn.fateverse.log.configuration.RabbitProperties;
import cn.fateverse.log.service.LoginInfoService;
import cn.fateverse.log.service.OperationService;
import cn.fateverse.log.entity.LoginInfo;
import cn.fateverse.log.entity.OperationLog;
import cn.fateverse.log.mq.RabbitConfig;
import org.apache.dubbo.config.annotation.DubboService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import javax.annotation.Resource;
import java.util.List;
import java.util.concurrent.Executor;

/**
 * @author Clay
 * @date 2023-02-20
 */
@DubboService
public class DubboLogServiceImpl implements DubboLogService {

    private final LoginInfoService loginInfoService;

    @Resource
    private RabbitTemplate rabbitTemplate;

    @Resource
    private RabbitProperties properties;

    private final OperationService operationService;

    private final Executor executor;

    public DubboLogServiceImpl(LoginInfoService loginInfoService, OperationService operationService, Executor executor) {
        this.loginInfoService = loginInfoService;
        this.operationService = operationService;
        this.executor = executor;
    }

    @Override
    public void batchSaveLog(List<OperationLog> list) {
        executor.execute(()->{
            rabbitTemplate.invoke(operations -> {
                rabbitTemplate.convertAndSend(properties.getExchangeLog(), properties.getRoutingKey(), list);
                return rabbitTemplate.waitForConfirms(5000);
            });
        });
    }

    @Override
    public void saveLoginInfo(LoginInfo info) {
        loginInfoService.save(info);
    }
}
