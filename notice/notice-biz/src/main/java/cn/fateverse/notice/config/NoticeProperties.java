package cn.fateverse.notice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.env.Environment;
import org.springframework.util.ObjectUtils;

import java.io.IOException;
import java.net.ServerSocket;


/**
 * Netty Websocket 配置文件
 *
 * @author Clay
 * @date 2023-04-14
 */
@ConfigurationProperties(prefix = "notice")
public class NoticeProperties {

    public static final String BROAD_ROUTING_KEY = "broad";
    /**
     * 应用名称
     */
    private String applicationName;
    /**
     * 服务端口,不填写则直接随机端口
     */
    private Integer port;
    /**
     * socket路径
     */
    private String path;
    /**
     * 交换机名称
     */
    private String exchangeChatRanch = "exchange.chat.ranch";
    /**
     * 队列名称
     */
    private String queueChatRanch = "queue.chat.ranch.";
    /**
     * 路由
     */
    private String routingKey = "chat.key.";

    public NoticeProperties(Environment environment) {
        ServerSocket socket = null;
        try {
            socket = new ServerSocket(0);
            this.port = socket.getLocalPort();
            socket.close();
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("端口获取失败,没有空余端口可以使用");
        }
        this.applicationName = environment.getProperty("spring.application.name");
        this.path = "ws";

    }

    public String getApplicationName() {
        return applicationName;
    }

    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        if (0 != port) {
            this.port = port;
        }
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getExchangeChatRanch() {
        return exchangeChatRanch;
    }

    public void setExchangeChatRanch(String exchangeChatRanch) {
        if (!ObjectUtils.isEmpty(exchangeChatRanch)){
            this.exchangeChatRanch = exchangeChatRanch;
        }
    }

    public String getQueueChatRanch() {
        return queueChatRanch;
    }

    public void setQueueChatRanch(String queueChatRanch) {
        if (!ObjectUtils.isEmpty(queueChatRanch)){
            this.queueChatRanch = queueChatRanch;
        }
    }

    public String getRoutingKey() {
        return routingKey;
    }

    public void setRoutingKey(String routingKey) {
        if (!ObjectUtils.isEmpty(routingKey)){
            this.routingKey = routingKey;
        }
    }
    /**
     * 广播路由
     */
    public String getBroadRoutingKey() {
        return routingKey + BROAD_ROUTING_KEY;
    }
}

