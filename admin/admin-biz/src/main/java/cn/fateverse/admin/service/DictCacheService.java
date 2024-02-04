package cn.fateverse.admin.service;

import cn.fateverse.admin.entity.DictData;
import cn.fateverse.common.core.constant.CacheConstants;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * @author Clay
 * @date 2022/11/9
 */
@Component
public class DictCacheService {


    @Resource
    private RedisTemplate<String, List<DictData>> redisTemplate;


    public void set(String key, List<DictData> dictDataList) {
        redisTemplate.opsForValue().set(getCacheKey(key), dictDataList);
    }

    public void setInit(String key, List<DictData> dictDataList) {
        String cacheKey = getCacheKey(key);
        List<DictData> dictData = redisTemplate.opsForValue().get(cacheKey);
        if (null == dictData) {
            redisTemplate.opsForValue().set(cacheKey, dictDataList);
        }
    }

    public void setTime(String key, List<DictData> dictDataList) {
        redisTemplate.opsForValue().set(getCacheKey(key), dictDataList, 30L, TimeUnit.MINUTES);
    }

    public List<DictData> get(String key) {
        return redisTemplate.opsForValue().get(getCacheKey(key));
    }

    public String getCacheKey(String key) {
        return CacheConstants.DICT_KEY + key;
    }

    public void remove(String key) {
        String cacheKey = getCacheKey(key);
        redisTemplate.delete(cacheKey);
    }

    public void clear() {
        Set<String> keys = redisTemplate.keys(CacheConstants.DICT_KEY + "*");
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
        }
    }

    @Async("fateverseExecutor")
    public void asyncRemove(String key) {
        remove(key);
    }
}
