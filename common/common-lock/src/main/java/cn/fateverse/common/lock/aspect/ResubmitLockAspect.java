package cn.fateverse.common.lock.aspect;

import cn.fateverse.common.core.constant.UserConstants;
import cn.fateverse.common.core.enums.ResultEnum;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.utils.HttpServletUtils;
import cn.fateverse.common.core.utils.IpUtils;
import cn.fateverse.common.core.utils.ReflectUserUtils;
import cn.fateverse.common.lock.annotation.ResubmitLock;
import cn.fateverse.common.lock.service.DistributedLockService;
import cn.fateverse.common.redis.constant.RedisConstant;
import cn.fateverse.common.redis.utils.ExpressionUtils;
import cn.fateverse.common.redis.utils.KeyUtils;
import lombok.NonNull;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ArrayUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.expression.EvaluationContext;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.servlet.http.HttpServletRequest;

/**
 * 防重复提交切面类
 * redis 中缓存key说明:
 * resubmit_lock(全局缓存前缀) + 用户信息(开启用户配置才会添加) + ip地址 + uri + 参数形成的md5唯一秘钥
 *
 * @author Clay
 * @date 2023-05-10
 */
@Slf4j
@Aspect
@ConditionalOnProperty(name = "enabled", prefix = "redis.resubmit-lock", havingValue = "true", matchIfMissing = true)
public class ResubmitLockAspect {
    //redis使用分隔符
    private static final String REDIS_SEPARATOR = RedisConstant.REDIS_SEPARATOR;
    //redis缓存全局前缀
    private static final String RESUBMIT_CHECK_KEY_PREFIX = "resubmit_lock" + REDIS_SEPARATOR;

    private final DistributedLockService distributedLockService;


    public ResubmitLockAspect(DistributedLockService distributedLockService) {
        this.distributedLockService = distributedLockService;
    }


    @SneakyThrows
    @Before("@within(resubmitLock) || @annotation(resubmitLock)")
    public void resubmitCheck(JoinPoint joinPoint, ResubmitLock resubmitLock) {
        // 获取方法签名
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        // 获取参数名称
        String[] parameterNames = methodSignature.getParameterNames();
        final Object[] args = joinPoint.getArgs();
        final String[] conditions = resubmitLock.conditions();
        EvaluationContext context = ExpressionUtils.getEvaluationContext(args, parameterNames);
        //根据条件判断是否需要进行防重复提交检查
        if (!ExpressionUtils.getConditionValue(context, conditions) || ArrayUtils.isEmpty(args)) {
            return;
        }
        doCheck(resubmitLock, args, context);
    }


    /**
     * key的组成为: resubmit_lock:userId:sessionId:uri:method:(根据spring EL表达式对参数进行拼接)
     *
     * @param resubmitLock 注解
     * @param args         方法入参
     */
    private void doCheck(@NonNull ResubmitLock resubmitLock, Object[] args, EvaluationContext context) {
        //配置的key
        final String[] keys = resubmitLock.keys();
        //获取到请求
        HttpServletRequest request = HttpServletUtils.getRequest();
        //获取到方法
        String method = request.getMethod();
        //获取到uri
        String uri = request.getRequestURI();
        //获取到锁的关键词
        StringBuilder lockKeyBuffer = new StringBuilder(RESUBMIT_CHECK_KEY_PREFIX);
        //获取用户信息
        Object loginUser = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //锁类型使用用户信息,并且用户信息存在,则将用户信息加到key中,若为匿名用户则将用户客户端的ip作为key
        if (resubmitLock.currentUser() && null != loginUser && !UserConstants.ANONYMOUS_USER.equals(loginUser)) {
            lockKeyBuffer.append(ReflectUserUtils.getToken(loginUser)).append(REDIS_SEPARATOR);
        } else {
            String ipAdder = IpUtils.getIpAdder(request);
            lockKeyBuffer.append(ipAdder).append(REDIS_SEPARATOR);
        }
        //将uri和请求类型放入
        lockKeyBuffer.append(uri).append(REDIS_SEPARATOR).append(method);
        // 将请求参数取md5值作为key的一部分，MD5理论上会重复，但是key中还包含session或者用户id，所以同用户在极端时间内请参数不同生成的相同md5值的概率极低
        String parametersKey = KeyUtils.getParametersKey(args, keys, resubmitLock.ignoreKeys(), resubmitLock.argsIndex(), REDIS_SEPARATOR, context);
        lockKeyBuffer.append(parametersKey);
        //进行锁的判断
        try {
            //尝试获取锁,等待时间为0,立即返回
            boolean isLock = distributedLockService.tryLock(lockKeyBuffer.toString(), 0, resubmitLock.interval(), resubmitLock.timeUnit());
            if (!isLock) {
                //没有获取到则视为重复提交
                throw new CustomException(ResultEnum.RESUBMIT_LOCK.msg, ResultEnum.RESUBMIT_LOCK.code);
            }
            //发生异常也视为重复提交
        } catch (InterruptedException e) {
            throw new CustomException(ResultEnum.RESUBMIT_LOCK.msg, ResultEnum.RESUBMIT_LOCK.code);
        }
    }
}
