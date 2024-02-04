package cn.fateverse.common.websocket;

import cn.fateverse.common.websocket.config.NoticeProperties;
import cn.fateverse.common.websocket.handler.WebSocketServerHandler;
import com.alibaba.cloud.nacos.NacosDiscoveryProperties;
import com.alibaba.cloud.nacos.NacosServiceManager;
import com.alibaba.cloud.nacos.registry.NacosRegistration;
import com.alibaba.nacos.api.exception.NacosException;
import com.alibaba.nacos.api.naming.NamingService;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;
import io.netty.handler.codec.http.websocketx.extensions.compression.WebSocketServerCompressionHandler;
import io.netty.handler.logging.LogLevel;
import io.netty.handler.logging.LoggingHandler;
import io.netty.handler.stream.ChunkedWriteHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.scheduling.annotation.Async;

/**
 * @author Clay
 * @date 2023-05-07
 */
@Slf4j
@SuppressWarnings("all")
public class NettyApplication implements ApplicationRunner {

    @Autowired
    private WebSocketServerHandler webSocketServerHandler;
    @Autowired
    private NacosDiscoveryProperties nacosDiscoveryProperties;
    @Autowired
    private NacosServiceManager nacosServiceManager;
    @Autowired
    private NacosRegistration registration;
    @Autowired
    private NoticeProperties properties;

    private NamingService namingService() {
        return this.nacosServiceManager.getNamingService(this.nacosDiscoveryProperties.getNacosProperties());
    }

    public void nettyRun() throws InterruptedException, NacosException {
        EventLoopGroup bossGroup = new NioEventLoopGroup();
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        String group = this.nacosDiscoveryProperties.getGroup();
        String service = this.properties.getApplicationName();
        String host = registration.getHost();
        try {
            ServerBootstrap serverBootstrap = new ServerBootstrap();
            serverBootstrap.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel channel) throws Exception {
                            ChannelPipeline pipeline = channel.pipeline();
                            pipeline.addLast("Http 编码(HTTP 协议解析，用于握手阶段)", new HttpServerCodec());
                            pipeline.addLast(new LoggingHandler(LogLevel.DEBUG));
                            pipeline.addLast(new HttpObjectAggregator(100 * 1024 * 1024));
                            pipeline.addLast(new ChunkedWriteHandler());
                            pipeline.addLast("WebSocket 数据压缩扩展", new WebSocketServerCompressionHandler());
                            pipeline.addLast("WebSocket 握手 控制帧处理", new WebSocketServerProtocolHandler(properties.getPath()));
                            pipeline.addLast(webSocketServerHandler);
                        }
                    });
            ChannelFuture channelFuture = serverBootstrap.bind(properties.getPort()).sync();
            log.info("Netty启动端口为:" + properties.getPort());
            namingService().registerInstance(service, group, host, properties.getPort());
            channelFuture.channel().closeFuture().sync();
        } finally {
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }

    @Async
    @Override
    public void run(ApplicationArguments args) {
        log.info("netty启动");
        try {
            nettyRun();
        } catch (InterruptedException | NacosException e) {
            e.printStackTrace();
            log.error("netty启动失败!");
        }
    }
}
