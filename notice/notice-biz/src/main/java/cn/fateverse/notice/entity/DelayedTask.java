package cn.fateverse.notice.entity;

import io.netty.channel.Channel;

import java.util.concurrent.Delayed;
import java.util.concurrent.TimeUnit;

/**
 * @author Clay
 * @date 2023-07-26
 */
public class DelayedTask implements Delayed {

    final private Channel channel;

    final private long expire;

    /**
     * 构造延时任务
     *
     * @param channel 通道
     * @param expire  任务延时时间（ms）
     */
    public DelayedTask(Channel channel, long expire) {
        super();
        this.expire = expire + System.currentTimeMillis();
        this.channel = channel;
    }

    @Override
    public long getDelay(TimeUnit unit) {
        return unit.convert(expire - System.currentTimeMillis(), unit);
    }


    @Override
    public int compareTo(Delayed delayed) {
        long delta = getDelay(TimeUnit.NANOSECONDS) - delayed.getDelay(TimeUnit.NANOSECONDS);
        return (int) delta;
    }

    public Channel getChannel() {
        return channel;
    }
}
