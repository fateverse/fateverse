package cn.fateverse.common.websocket.handler;

import io.netty.channel.SimpleChannelInboundHandler;

/**
 * websocket业务实现类,引入当前模块的服务需要实现当前类,编写自己的业务服务
 *
 * @author Clay
 * @date 2023-05-07
 */
public abstract class WebSocketServerHandler<T> extends SimpleChannelInboundHandler<T> {
}
