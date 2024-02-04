package cn.fateverse.notice.handler;

import cn.fateverse.notice.entity.DelayedTask;
import cn.fateverse.notice.entity.UserInfo;
import io.netty.channel.Channel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.concurrent.DelayQueue;
import java.util.concurrent.Executors;

/**
 * @author Clay
 * @date 2023-07-26
 */
@Slf4j
@Component
public class DelayQueueChannelAuth implements CommandLineRunner {


    private final DelayQueue<DelayedTask> delayQueue = new DelayQueue<>();

    /**
     * 加入到延时队列中
     * @param task
     */
    public void put(DelayedTask task) {
        log.error("加入延时任务：{}", task);
        delayQueue.put(task);
    }

    @Override
    public void run(String... args) throws Exception {
        Executors.newSingleThreadExecutor().execute(new Thread(this::executeThread));
    }



    /**
     * 延时任务执行线程
     */
    private void executeThread() {
        while (true) {
            try {
                DelayedTask task = delayQueue.take();
                Channel channel = task.getChannel();
                UserInfo userInfo = channel.attr(ChannelHandlerPool.USER_INFO).get();
                if (null == userInfo){
                    channel.close();
                }
            } catch (InterruptedException e) {
                break;
            }
        }
    }
}
