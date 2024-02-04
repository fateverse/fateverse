package cn.fateverse.notice.mq;

import cn.fateverse.notice.entity.NoticeMq;
import cn.fateverse.notice.handler.NoticeConsumeHandler;
import com.rabbitmq.client.Channel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.io.IOException;

/**
 * MQ 监听器
 *
 * @author Clay
 * @date 2023-04-15
 */
@Slf4j
@Component
public class RabbiListener {

    /**
     * 最大重试次数
     */
    private static final int MAX_RETRIES = 3;

    @Resource
    private NoticeConsumeHandler consumeHandler;

    @RabbitListener(queues = "#{queueChat.name}")
    public void consumeNotice(NoticeMq notice, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {
        // 获取消息的重试次数
        log.info("**********************************");
        log.info(notice.toString());
        // 重试次数
        int retryCount = 0;
        boolean consumeStart = false;
        while (retryCount < MAX_RETRIES) {
            retryCount++;
            log.info("消费业务!");
            consumeStart = consumeHandler.consumeNotice(notice);
            if (consumeStart) {
                break;
            }
        }
        if (consumeStart) {
            channel.basicAck(tag, false);
        } else {
            channel.basicNack(tag, false, false);
        }
    }
}
