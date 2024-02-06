package cn.fateverse.notice.handler;

import cn.hutool.core.util.StrUtil;
import cn.fateverse.admin.entity.Role;
import cn.fateverse.admin.entity.User;
import cn.fateverse.common.redis.constant.RedisConstant;
import cn.fateverse.notice.entity.DelayedTask;
import cn.fateverse.notice.entity.SocketAuth;
import cn.fateverse.notice.entity.UserInfo;
import cn.fateverse.notice.mq.RabbitConfig;
import cn.fateverse.common.security.entity.LoginUser;
import cn.fateverse.common.security.service.TokenService;
import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import io.netty.channel.*;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * @author Clay
 * @date 2023-04-12
 */
@Slf4j
@ChannelHandler.Sharable
@Component
public class NoticeSocketServerHandler extends SimpleChannelInboundHandler<TextWebSocketFrame> {

    private final RedisTemplate<String, UserInfo> redisTemplate;

    private final TokenService tokenService;

    private final RabbitConfig rabbitConfig;

    private final DelayQueueChannelAuth delayQueueChannelAuth;

    public NoticeSocketServerHandler(@Qualifier("noticeRedisTemplate") RedisTemplate<String, UserInfo> redisTemplate, TokenService tokenService, RabbitConfig rabbitConfig, DelayQueueChannelAuth delayQueueChannelAuth) {
        this.redisTemplate = redisTemplate;
        this.tokenService = tokenService;
        this.rabbitConfig = rabbitConfig;
        this.delayQueueChannelAuth = delayQueueChannelAuth;
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        delayQueueChannelAuth.put(new DelayedTask(ctx.channel(), 3000));
        super.channelActive(ctx);
    }


    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        Channel channel = ctx.channel();
        if (!ctx.isRemoved()) {
            UserInfo info = channel.attr(ChannelHandlerPool.USER_INFO).get();
            if (null == info) {
                return;
            }
            redisTemplate.delete(ChannelHandlerPool.getRedisKey(info.getCluster()) + ":" + info.getRedisKey());
            log.info("用户被删除******************************");
            ChannelHandlerPool.removeChannel(channel, info.getCluster());
            log.info("用户退出");
        }
        super.channelInactive(ctx);
    }

    /**
     * 处理WebSocket事件,websocket传输只会进行授权,并且实现ping ping 的状态验证,防止nginx代理时自动断开连接
     *
     * @param ctx   the {@link ChannelHandlerContext} which this {@link SimpleChannelInboundHandler}
     *              belongs to
     * @param frame the message to handle
     */
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, TextWebSocketFrame frame) {
        // 处理文本消息
        String text = frame.text();
        Channel channel = ctx.channel();
        JSONObject object;
        try {
            object = JSON.parseObject(text);
        } catch (Exception e) {
            object = new JSONObject();
            closeChannel(channel, object, "数据异常");
            return;
        }
        String type = object.getString("type");
        if (StrUtil.isBlank(type)) {
            closeChannel(channel, new JSONObject(), "类型为空");
            return;
        }
        try {
            switch (type) {
                case "ping":
                    writePong(channel);
                    UserInfo userInfo = channel.attr(ChannelHandlerPool.USER_INFO).get();
                    redisTemplate.expire(ChannelHandlerPool.getRedisKey(userInfo.getCluster()) + RedisConstant.REDIS_SEPARATOR + userInfo.getRedisKey(), 60, TimeUnit.SECONDS);
                    return;
                case "auth":
                    auth(text, channel);
                    break;
                default:
                    closeChannel(channel, object, "类型异常");
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            closeChannel(channel, object, "数据异常");
        }
    }


    private void auth(String text, Channel channel) {
        SocketAuth auth = JSON.parseObject(text, SocketAuth.class);
        if (auth != null && !StrUtil.isEmpty(auth.getToken())) {
            //根据token获取到授权信息
            LoginUser loginUser = tokenService.getLoginUser(auth.getToken());
            if (null == loginUser) {
                closeChannel(channel, new JSONObject(), "授权失败");
                return;
            }
            //获取到用户信息
            User user = loginUser.getUser();
            String userId = user.getUserId().toString();
            String ip = "";
            try {
                ip = InetAddress.getLocalHost().getHostAddress();
            } catch (UnknownHostException e) {
                ip = "0.0.0.0";
            }
            String redisKey = ChannelHandlerPool.getRedisKey(auth.getCluster());
            String subKey = userId + RedisConstant.REDIS_SEPARATOR + ip + RedisConstant.REDIS_SEPARATOR + System.currentTimeMillis();
            //整理netty集群中需要的用户信息
            UserInfo info = UserInfo.builder()
                    .userId(userId)
                    .redisKey(subKey)
                    .cluster(auth.getCluster())
                    .routingKey(rabbitConfig.getRoutingKey())
                    .channelId(channel.id())
                    .build();
            //存放到redis中
            redisTemplate.opsForValue().set(redisKey + RedisConstant.REDIS_SEPARATOR + subKey, info, RedisConstant.REDIS_EXPIRE, TimeUnit.SECONDS);
            //将用户的角色和部门放入到info中,并设置到channel中,方便后续取用
            Set<Long> roleSet = user.getRoles().stream().map(Role::getRoleId).collect(Collectors.toSet());
            info.setRoleSet(roleSet);
            info.setDeptId(user.getDeptId());
            try {
                Set<Long> deptAncestors = Arrays.stream(user.getDept().getAncestors().trim().split(",")).map(Long::valueOf).collect(Collectors.toSet());
                info.setDeptAncestors(deptAncestors);
            } catch (Exception e) {
                log.error("部门祖级列表转换失败");
                info.setDeptAncestors(new HashSet<>());
            }
            //设置用户信息
            channel.attr(ChannelHandlerPool.USER_INFO).set(info);
            //将当前channel添加到channel池中
            ChannelHandlerPool.addChannel(channel, auth.getCluster());
            log.info("用户授权成功");
        }
    }

    private void writePong(Channel channel) {
        String SEND_PONG = "{\"type\": \"pong\"}";
        channel.writeAndFlush(new TextWebSocketFrame(SEND_PONG));
    }


    private void closeChannel(Channel channel, JSONObject object, String msg) {
        object.put("type", "error");
        object.put("msg", msg);
        channel.writeAndFlush(ChannelHandlerPool.getText(object));
        channel.close();
    }

}
