package cn.fateverse.log.mq;

import cn.fateverse.log.service.OperationService;
import cn.fateverse.log.entity.OperationLog;
import com.google.common.util.concurrent.ThreadFactoryBuilder;
import com.rabbitmq.client.Channel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * @author Clay
 * @date 2023-08-02
 */
@Slf4j
@Component
public class RabbiListener {


    private final ThreadPoolExecutor executor;

    private final OperationService operationService;
    /**
     * 最大重试次数
     */
    private static final int MAX_RETRIES = 3;

    public RabbiListener(OperationService operationService) {
        this.operationService = operationService;
        executor = new ThreadPoolExecutor(2,
                4,
                60,
                TimeUnit.SECONDS,new LinkedBlockingDeque<>(128),
                new ThreadFactoryBuilder().setNameFormat("rabbit_%d").build(),
                new ThreadPoolExecutor.CallerRunsPolicy());
    }


    @RabbitListener(queues = "#{queueLog.name}")
    public void consumeLog(List<OperationLog> operationLogList, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) {
        executor.submit(() -> saveLog(operationLogList, channel, tag));
    }


    public void saveLog(List<OperationLog> operationLogList, Channel channel, long tag) {
        int retryCount = 0;
        boolean consumeStart = false;
        while (retryCount < MAX_RETRIES) {
            retryCount++;
            log.info("消费业务!");
            try {
                operationService.batchSave(operationLogList);
                consumeStart = true;
                break;
            } catch (Exception e) {
                e.printStackTrace();
                retryCount++;
                log.error("操作日志失败,次数:" + retryCount);
                log.error("异常信息", e);
            }
        }
        try {
            if (consumeStart) {
                channel.basicAck(tag, false);
            } else {
                channel.basicNack(tag, false, false);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


}

