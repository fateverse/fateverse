package cn.fateverse.common.redis.configure;

import cn.fateverse.common.redis.configure.properties.RedissonProperties;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import lombok.extern.slf4j.Slf4j;
import org.redisson.codec.JsonJacksonCodec;
import org.redisson.config.ClusterServersConfig;
import org.redisson.config.SingleServerConfig;
import org.redisson.spring.data.connection.RedissonConnectionFactory;
import org.redisson.spring.starter.RedissonAutoConfigurationCustomizer;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.autoconfigure.data.redis.RedisProperties;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.util.ObjectUtils;

import javax.annotation.Resource;
import java.util.Optional;


@Slf4j
@EnableCaching
@EnableConfigurationProperties({RedissonProperties.class})
public class RedisConfig {

    @Resource
    private RedisProperties properties;

    @Resource
    private RedissonProperties redissonProperties;

    @Resource
    private ObjectMapper objectMapper;


    @Bean
    public BeanPostProcessor redisTemplatePostProcessor(RedissonConnectionFactory redissonConnectionFactory) {
        return new BeanPostProcessor() {
            @Override
            public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
                if ("redisTemplate".equals(beanName) && bean instanceof RedisTemplate) {
                    RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
                    redisTemplate.setConnectionFactory(redissonConnectionFactory);

                    Jackson2JsonRedisSerializer<Object> jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer<>(Object.class);
                    ObjectMapper objectMapper = new ObjectMapper();
                    objectMapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
                    objectMapper.activateDefaultTyping(LaissezFaireSubTypeValidator.instance, ObjectMapper.DefaultTyping.NON_FINAL, JsonTypeInfo.As.PROPERTY);
                    jackson2JsonRedisSerializer.setObjectMapper(objectMapper);

                    StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();

                    //设置key序列化方式string
                    redisTemplate.setKeySerializer(stringRedisSerializer);
                    //设置value的序列化方式json
                    redisTemplate.setValueSerializer(jackson2JsonRedisSerializer);
                    redisTemplate.setHashKeySerializer(stringRedisSerializer);
                    redisTemplate.setHashValueSerializer(jackson2JsonRedisSerializer);
                    redisTemplate.afterPropertiesSet();
                    return redisTemplate;
                }
                return bean;
            }
        };
    }


    @Bean
    public RedissonAutoConfigurationCustomizer redissonCustomizer() {
        return config -> {
            config.setThreads(redissonProperties.getThreads())
                    .setNettyThreads(redissonProperties.getNettyThreads())
                    .setCodec(new JsonJacksonCodec(objectMapper));
            RedissonProperties.SingleServerConfig singleServerConfig = redissonProperties.getSingleServerConfig();
            if (!ObjectUtils.isEmpty(singleServerConfig)) {
                // 使用单机模式
                SingleServerConfig singleServer = config.useSingleServer();
                singleServer
                        .setDatabase(properties.getDatabase())
                        //设置redis key前缀
                        .setTimeout(singleServerConfig.getTimeout())
                        .setClientName(singleServerConfig.getClientName())
                        .setIdleConnectionTimeout(singleServerConfig.getIdleConnectionTimeout())
                        .setSubscriptionConnectionPoolSize(singleServerConfig.getSubscriptionConnectionPoolSize())
                        .setConnectionMinimumIdleSize(singleServerConfig.getConnectionMinimumIdleSize())
                        .setConnectionPoolSize(singleServerConfig.getConnectionPoolSize())
                        .setPingConnectionInterval(Optional.ofNullable(singleServerConfig.getPingConnectionInterval()).orElse(3000));
                if (!ObjectUtils.isEmpty(properties.getPassword())) {
                    singleServer.setPassword(properties.getPassword());
                }
            }
            // 集群配置方式 参考下方注释
            RedissonProperties.ClusterServersConfig clusterServersConfig = redissonProperties.getClusterServersConfig();
            if (!ObjectUtils.isEmpty(clusterServersConfig)) {
                ClusterServersConfig clusterServers = config.useClusterServers();
                clusterServers
                        //设置redis key前缀
                        .setTimeout(clusterServersConfig.getTimeout())
                        .setClientName(clusterServersConfig.getClientName())
                        .setIdleConnectionTimeout(clusterServersConfig.getIdleConnectionTimeout())
                        .setSubscriptionConnectionPoolSize(clusterServersConfig.getSubscriptionConnectionPoolSize())
                        .setMasterConnectionMinimumIdleSize(clusterServersConfig.getMasterConnectionMinimumIdleSize())
                        .setMasterConnectionPoolSize(clusterServersConfig.getMasterConnectionPoolSize())
                        .setSlaveConnectionMinimumIdleSize(clusterServersConfig.getSlaveConnectionMinimumIdleSize())
                        .setSlaveConnectionPoolSize(clusterServersConfig.getSlaveConnectionPoolSize())
                        .setReadMode(clusterServersConfig.getReadMode())
                        .setSubscriptionMode(clusterServersConfig.getSubscriptionMode())
                        .setPingConnectionInterval(Optional.ofNullable(singleServerConfig.getPingConnectionInterval()).orElse(3000));
                if (!ObjectUtils.isEmpty(properties.getPassword())) {
                    clusterServers.setPassword(properties.getPassword());
                }
            }
            log.info("初始化 redis 配置");
        };
    }

    /**
     * redis集群配置 yml
     *
     * --- # redis 集群配置(单机与集群只能开启一个另一个需要注释掉)
     * spring:
     *   redis:
     *     cluster:
     *       nodes:
     *         - 192.168.0.100:6379
     *         - 192.168.0.101:6379
     *         - 192.168.0.102:6379
     *     # 密码
     *     password:
     *     # 连接超时时间
     *     timeout: 10s
     *     # 是否开启ssl
     *     ssl: false
     *
     * redisson:
     *   # 线程池数量
     *   threads: 16
     *   # Netty线程池数量
     *   nettyThreads: 32
     *   # 集群配置
     *   clusterServersConfig:
     *     # master最小空闲连接数
     *     masterConnectionMinimumIdleSize: 32
     *     # master连接池大小
     *     masterConnectionPoolSize: 64
     *     # slave最小空闲连接数
     *     slaveConnectionMinimumIdleSize: 32
     *     # slave连接池大小
     *     slaveConnectionPoolSize: 64
     *     # 连接空闲超时，单位：毫秒
     *     idleConnectionTimeout: 10000
     *     # 命令等待超时，单位：毫秒
     *     timeout: 3000
     *     # 发布和订阅连接池大小
     *     subscriptionConnectionPoolSize: 50
     *     # 读取模式
     *     readMode: "SLAVE"
     *     # 订阅模式
     *     subscriptionMode: "MASTER"
     */

}

