package cn.fateverse.log.mq;

import cn.fateverse.log.configuration.RabbitProperties;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Clay
 * @date 2023-08-02
 */
@Configuration
@EnableConfigurationProperties(RabbitProperties.class)
public class RabbitConfig {

    @Resource
    private RabbitProperties properties;

    /**
     * 交换机
     *
     * @return topic交换机
     */
    @Bean
    public TopicExchange exchangeLog() {
        return new TopicExchange(properties.getExchangeLog());
    }

    /**
     * 队列
     *
     * @return 队列
     */
    @Bean
    public Queue queueLog() {
        Map<String, Object> args = new HashMap<>(8);
        args.put("x-expires", 60000);
        return new Queue(properties.getQueueLog(), true, false, false, args);
    }


    /**
     * 当前节点绑定的mq
     *
     * @param queueLog    队列
     * @param exchangeLog 交换机
     * @return 绑定结果
     */
    @Bean
    public Binding binding(Queue queueLog, TopicExchange exchangeLog) {
        return BindingBuilder.bind(queueLog).to(exchangeLog).with(properties.getRoutingKey());
    }

}
