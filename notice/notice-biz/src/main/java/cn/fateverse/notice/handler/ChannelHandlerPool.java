package cn.fateverse.notice.handler;

import cn.fateverse.notice.entity.NoticeMq;
import cn.fateverse.notice.entity.UserInfo;
import cn.fateverse.notice.entity.vo.NotifyVo;
import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import io.netty.channel.Channel;
import io.netty.channel.ChannelId;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.util.AttributeKey;
import io.netty.util.concurrent.GlobalEventExecutor;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Predicate;

/**
 * 管道池
 *
 * @author Clay
 * @date 2023-04-14
 */
public class ChannelHandlerPool {

    public static final AttributeKey<UserInfo> USER_INFO = AttributeKey.valueOf("userInfo");

    /**
     * channelGroup通道组
     */
    private static final Map<String, ChannelGroup> CHANNEL_GROUP_CLUSTER = new ConcurrentHashMap<>();

    /**
     * 可以存储userId与ChannelId的映射表
     */
    public static String channelUserKey = "notice:user:channel:";

    /**
     * 添加管道
     *
     * @param channel 需要新增的管道
     */
    public static void addChannel(Channel channel, String cluster) {
        ChannelGroup channelGroup = CHANNEL_GROUP_CLUSTER.get(cluster);
        if (null == channelGroup) {
            synchronized (CHANNEL_GROUP_CLUSTER) {
                channelGroup = CHANNEL_GROUP_CLUSTER.get(cluster);
                if (null == channelGroup) {
                    channelGroup = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);
                }
            }
        }
        channelGroup.add(channel);
        CHANNEL_GROUP_CLUSTER.put(cluster, channelGroup);
    }

    /**
     * 获取到管道
     *
     * @param channelId 管道id
     * @return 返回管道
     */
    public static Channel getChannel(ChannelId channelId, String cluster) {
        ChannelGroup channelGroup = CHANNEL_GROUP_CLUSTER.get(cluster);
        if (null == channelGroup) {
            return null;
        }
        return channelGroup.find(channelId);
    }

    /**
     * 根据条件发送到
     *
     * @param predicate 筛选条件
     * @param notice    需要推送的消息
     * @return 推送结果
     */
    public static boolean sendPredicateChannel(Predicate<Channel> predicate, NoticeMq notice) {
        ChannelGroup channelGroup = CHANNEL_GROUP_CLUSTER.get(notice.getCluster());
        if (null == channelGroup) {
            return true;
        }
        NotifyVo notifyVo = NotifyVo.toNotifyVo(notice);
        JSONObject send = new JSONObject();
        send.put("type","notice");
        send.put("notice",notifyVo);
        channelGroup.writeAndFlush(ChannelHandlerPool.getText(send), predicate::test);
        return true;
    }

    /**
     * 移除管道
     *
     * @param channel 需要移除的管道
     */
    public static void removeChannel(Channel channel, String cluster) {
        ChannelGroup channelGroup = CHANNEL_GROUP_CLUSTER.get(cluster);
        if (null != channelGroup) {
            channelGroup.remove(channel);
        }
    }

    /**
     * 获取到redis中的key
     *
     * @param cluster 群组
     * @return 拼接完成的Redis key
     */
    public static String getRedisKey(String cluster) {
        return ChannelHandlerPool.channelUserKey + cluster;
    }

    /**
     * 将对象转换为netty需要的文本类型对象
     *
     * @param object 需要转换的对象
     * @return netty文本对象
     */
    public static TextWebSocketFrame getText(Object object) {
        return new TextWebSocketFrame(JSON.toJSONString(object));
    }
}
