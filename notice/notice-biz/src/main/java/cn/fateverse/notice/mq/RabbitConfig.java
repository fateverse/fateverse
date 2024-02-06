package cn.fateverse.notice.mq;

import cn.fateverse.notice.config.NoticeProperties;
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.Resource;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;

/**
 * Mq的相关配置
 *
 * @author Clay
 * @date 2023-04-15
 */
@Configuration
public class RabbitConfig {

    @Resource
    private NoticeProperties properties;

    /**
     * 交换机
     *
     * @return topic交换机
     */
    @Bean
    public TopicExchange exchangeChat() {
        return new TopicExchange(properties.getExchangeChatRanch());
    }

    /**
     * 队列
     *
     * @return 队列
     */
    @Bean
    public Queue queueChat() {
        Map<String, Object> args = new HashMap<>(8);
//        args.put("x-expires", 60000);
        return new Queue(getKey(properties.getQueueChatRanch()), true, false, false, args);
    }

    /**
     * 获取到集群动态的key值,key值由ip加的端口组成
     *
     * @param key 路由或者交换机
     * @return 最总的key
     */
    private String getKey(String key) {
        String ip = "";
        try {
            ip = InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            ip = "0.0.0.0";
        }
        return key + "(" + ip + ":" + properties.getPort() + ")";
    }

    /**
     * 获取到路由的key
     *
     * @return 路由key
     */
    public String getRoutingKey() {
        return getKey(properties.getRoutingKey());
    }

    /**
     * 当前节点绑定的mq
     *
     * @param queueChat    队列
     * @param exchangeChat 交换机
     * @return 绑定结果
     */
    @Bean
    public Binding binding(Queue queueChat, TopicExchange exchangeChat) {
        return BindingBuilder.bind(queueChat).to(exchangeChat).with(getRoutingKey());
    }

    /**
     * 广播点绑定的mq
     *
     * @param queueChat    队列
     * @param exchangeChat 交换机
     * @return 绑定结果
     */
    @Bean
    public Binding bindingAll(Queue queueChat, TopicExchange exchangeChat) {
        return BindingBuilder.bind(queueChat).to(exchangeChat).with(properties.getBroadRoutingKey());
    }

}
