package cn.fateverse.common.redis.aspect;

import cn.fateverse.common.redis.enums.RedisCacheType;
import cn.fateverse.common.redis.utils.ExpressionUtils;
import cn.fateverse.common.redis.utils.KeyUtils;
import cn.fateverse.common.redis.constant.RedisConstant;
import cn.fateverse.common.redis.exception.RedisCacheException;
import cn.fateverse.common.redis.annotation.RedisCache;
import com.alibaba.nacos.common.utils.ArrayUtils;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.expression.EvaluationContext;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.util.ObjectUtils;

import javax.annotation.Resource;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * redis 缓存切面类
 * <p>
 * redis中缓存key说明:
 * 1. 通用数据类型
 * 全局缓存前缀 + 自定义缓存前缀 + 调用类类路径 + other + 调用函数名 + 参数组合形成的md5key
 * 2. 主键数据类型
 * 全局缓存前缀 + 自定义缓存前缀 + 调用类类路径 + primary_key + 调用函数名 + 主键数据id
 *
 * @author Clay
 * @date 2023-06-05
 */
@Slf4j
@Aspect
@ConditionalOnProperty(name = "enabled", prefix = "redis.cache", havingValue = "true", matchIfMissing = true)
public class RedisCacheAspect {
    //redis使用分隔符
    private static final String REDIS_SEPARATOR = RedisConstant.REDIS_SEPARATOR;
    //redis缓存全局前缀
    private static final String REDIS_CACHE_KEY_PREFIX = "redis:cache" + REDIS_SEPARATOR;
    //主键标识前缀
    private static final String PRIMARY_KEY = "primary:key" + REDIS_SEPARATOR;
    //其他数据类型标识前缀
    private static final String OTHER = "other" + REDIS_SEPARATOR;
    //分布式锁标记
    public static final String LOCK = "lock";

    @Resource
    private ThreadPoolTaskExecutor executor;

    @Resource
    private RedisTemplate<String, Object> restTemplate;


    @Resource
    private RedissonClient redissonClient;

    @Around("@within(redisCache) || @annotation(redisCache)")
    public Object redisCacheCheck(ProceedingJoinPoint point, RedisCache redisCache) throws Throwable {
        final Object[] args = point.getArgs();
        // 获取方法签名
        MethodSignature methodSignature = (MethodSignature) point.getSignature();
        // 获取参数名称
        String[] parameterNames = methodSignature.getParameterNames();
        final String[] conditions = redisCache.conditions();
        //根据条件判断是否需要进行防重复提交检查
        EvaluationContext context = ExpressionUtils.getEvaluationContext(args, parameterNames);
        if (!ExpressionUtils.getConditionValue(context, conditions) || ArrayUtils.isEmpty(args)) {
            return point.proceed();
        }
        if (ObjectUtils.isEmpty(redisCache.prefix())) {
            throw new RedisCacheException("redis cache prefix can't be null...");
        }
        RedisCacheType type = redisCache.type();
        switch (type) {
            case GET:
            case GET_BY_PRIMARY_KEY:
                return getCache(point, redisCache, context);
            case INSERT:
                return insertCache(point, redisCache);
            case UPDATE:
            case DELETE:
                return updateCache(point, redisCache, context);
            default:
                throw new RedisCacheException("redis cache type is not exist!");
        }
    }

    /**
     * 更新缓存,更新主键标识缓存,和非主键标识缓存
     *
     * @param point      切点
     * @param redisCache 注解信息
     * @return 数据
     * @throws Throwable 报错信息
     */
    private Object updateCache(ProceedingJoinPoint point, RedisCache redisCache, EvaluationContext context) throws Throwable {
        //获取到键信息
        StringBuilder redisCacheBuffer = getRedisCacheClassKey(point, redisCache);
        //当前为更新方法,所以当前的键定义为other为后续删除
        StringBuilder other = new StringBuilder(redisCacheBuffer).append(OTHER).append("*");
        //构建主键key
        StringBuilder primaryKey = new StringBuilder(redisCacheBuffer);
        //判断当前主键key是否为空,如果不为空则删除该数据信息
        if (!ObjectUtils.isEmpty(redisCache.primaryKey())) {
            Object parametersKey = ExpressionUtils.getExpressionValue(context, redisCache.primaryKey());
            primaryKey.append(PRIMARY_KEY).append("*").append(parametersKey);
            deleteObject(primaryKey);
        }
        //第一次删除缓存数据
        deleteObject(other);
        //执行目标方法
        Object proceed = point.proceed();
        //执行方法完成后异步再次删除
        asyncDeleteObject(other);
        //进行主键的异步删除
        if (!ObjectUtils.isEmpty(redisCache.primaryKey())) {
            asyncDeleteObject(primaryKey);
        }
        return proceed;
    }

    private void asyncDeleteObject(StringBuilder primaryKey) {
        executor.execute(() -> {
            deleteObject(primaryKey);
        });
    }

    private void deleteObject(StringBuilder key) {
        Set<String> keys = restTemplate.scan(ScanOptions.scanOptions().match(key.toString()).build())
                .stream().collect(Collectors.toSet());
        restTemplate.delete(keys);
    }

    /**
     * 更新缓存,主要更新非组件标识的缓存数据
     *
     * @param point      切点
     * @param redisCache 注解信息
     * @return 数据
     * @throws Throwable 报错信息
     */
    private Object insertCache(ProceedingJoinPoint point, RedisCache redisCache) throws Throwable {
        StringBuilder key = getRedisCacheClassKey(point, redisCache);
        key.append(OTHER).append("*");
        //修改数据库之前先同步删除
        deleteObject(key);
        Object proceed = point.proceed();
        //数据修改完成后异步再次删除
        asyncDeleteObject(key);
        return proceed;
    }

    /**
     * 获取到数据
     *
     * @param point      切点
     * @param redisCache 注解信息
     * @return 数据
     * @throws Throwable 报错信息
     */
    private Object getCache(ProceedingJoinPoint point, RedisCache redisCache, EvaluationContext context) throws Throwable {
        final Object[] args = point.getArgs();
        StringBuilder redisCacheBuffer = getRedisCacheClassKey(point, redisCache);
        String parametersKey;
        //判断当前方法的类型是否为主键获取,并且指定组件方法
        if (redisCache.type().equals(RedisCacheType.GET_BY_PRIMARY_KEY) && !ObjectUtils.isEmpty(redisCache.primaryKey())) {
            redisCacheBuffer.append(PRIMARY_KEY);
            parametersKey = Objects.requireNonNull(ExpressionUtils.getExpressionValue(context, redisCache.primaryKey())).toString();
        } else {
            redisCacheBuffer.append(OTHER);
            parametersKey = KeyUtils.getParametersKey(args, redisCache.keys(), redisCache.ignoreKeys(), redisCache.argsIndex(), REDIS_SEPARATOR, context);
        }
        String methodName = point.getSignature().getName();
        //天剑方法
        redisCacheBuffer.append(methodName);
        //添加参数key
        redisCacheBuffer.append(REDIS_SEPARATOR).append(parametersKey);
        //转换为redis的键
        String redisKey = redisCacheBuffer.toString();
        //从redis中获取到value
        Object cacheValue = restTemplate.opsForValue().get(redisKey);
        if (null == cacheValue) {
            //此处使用分布式锁
            String lockKey = redisCacheBuffer.append(RedisConstant.REDIS_SEPARATOR)
                    .append(LOCK).toString();
            RLock lock = redissonClient.getFairLock(lockKey);
            try {
                if (lock.tryLock(5, TimeUnit.SECONDS)) {
                    //尝试再次获取
                    cacheValue = restTemplate.opsForValue().get(redisKey);
                    //如果还是未获取到,则执行方法生成
                    if (null == cacheValue) {
                        cacheValue = point.proceed();
                        //如果注解未设置过期时间
                        if (redisCache.timeout() == 0) {
                            restTemplate.opsForValue().set(redisKey, cacheValue);
                        } else {
                            restTemplate.opsForValue().set(redisKey, cacheValue, redisCache.timeout(), redisCache.timeUnit());
                        }
                    }
                }
            } finally {
                if (lock.isLocked() && lock.isHeldByCurrentThread()) {
                    lock.unlock();
                }
            }
        }
        return cacheValue;
    }

    /**
     * 获取到redis cache key 到 class 的关键字
     *
     * @param point      切点
     * @param redisCache 注解信息
     * @return cache key
     */
    private StringBuilder getRedisCacheClassKey(ProceedingJoinPoint point, RedisCache redisCache) {
        //获取到redis key的的关键词
        StringBuilder redisCacheBuffer = new StringBuilder(REDIS_CACHE_KEY_PREFIX);
        redisCacheBuffer.append(redisCache.prefix()).append(REDIS_SEPARATOR);
        // 获取到报名 类名 函数名
        String className = point.getTarget().getClass().getName();
        redisCacheBuffer.append(className).append(REDIS_SEPARATOR);
        return redisCacheBuffer;
    }

}

