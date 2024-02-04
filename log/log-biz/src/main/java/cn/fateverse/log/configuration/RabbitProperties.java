package cn.fateverse.log.configuration;


import cn.fateverse.common.core.utils.ObjectUtils;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "log")
public class RabbitProperties {

    /**
     * 交换机名称
     */
    public String exchangeLog = "exchange.log";

    /**
     * 队列名称
     */
    private String queueLog = "queue.log";

    /**
     * 路由
     */
    public String routingKey = "log.routing";

    public String getExchangeLog() {
        return exchangeLog;
    }

    public void setExchangeLog(String exchangeLog) {
        if (!ObjectUtils.isEmpty(exchangeLog)) {
            this.exchangeLog = exchangeLog;
        }
    }

    public String getQueueLog() {
        return queueLog;
    }

    public void setQueueLog(String queueLog) {
        if (!ObjectUtils.isEmpty(queueLog)) {
            this.queueLog = queueLog;
        }
    }

    public String getRoutingKey() {
        return routingKey;
    }

    public void setRoutingKey(String routingKey) {
        if (!ObjectUtils.isEmpty(routingKey)) {
            this.routingKey = routingKey;
        }
    }
}
