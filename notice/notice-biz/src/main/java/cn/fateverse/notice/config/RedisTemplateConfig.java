package cn.fateverse.notice.config;

import cn.fateverse.notice.entity.UserInfo;
import org.redisson.spring.data.connection.RedissonConnectionFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * @author Clay
 * @date 2023-10-15
 */
@Configuration
public class RedisTemplateConfig {


    @Bean("noticeRedisTemplate")
    public RedisTemplate<String, UserInfo> noticeRedisTemplate(RedissonConnectionFactory redissonConnectionFactory) {
        RedisTemplate<String, UserInfo> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redissonConnectionFactory);
        //设置key序列化方式string
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.afterPropertiesSet();
        return redisTemplate;
    }



}
