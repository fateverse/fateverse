package cn.fateverse.common.security.service;

import cn.hutool.core.util.StrUtil;
import cn.fateverse.common.core.constant.CacheConstants;
import cn.fateverse.common.core.constant.Constants;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.utils.HttpServletUtils;
import cn.fateverse.common.core.utils.ObjectUtils;
import cn.fateverse.common.security.entity.LoginUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.data.redis.core.RedisTemplate;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * token验证处理
 *
 * @author Clay
 * @date 2022/10/27
 */
@Slf4j
@RefreshScope
@ConfigurationProperties(prefix = "token")
public class TokenService {

    /**
     * 令牌自定义标识
     */
    private String header;

    /**
     * 令牌秘钥
     */
    private String secret;

    /**
     * 令牌有效期（默认30分钟）
     */
    private long expireTime;

    protected static final long MILLIS_SECOND = 1000;

    protected static final long MILLIS_MINUTE = 60 * MILLIS_SECOND;

    private static final Long MILLIS_MINUTE_TEN = 20 * 60 * 1000L;


    @Resource
    private RedisTemplate<String, LoginUser> redisTemplate;


    /**
     * 获取用户身份信息
     *
     * @return 用户信息
     */
    public LoginUser getLoginUser(HttpServletRequest request) {
        // 获取请求携带的令牌
        String token = getToken(request);
        return getLoginUser(token);
    }

    /**
     * 用户登出
     */
    public void userLogout() {
        delLoginUser(getToken());
    }

    public LoginUser getLoginUser(String token) {
        if (null != token && !StrUtil.isEmpty(token)) {
            Claims claims = parseToken(token);
            if (null == claims) {
                return null;
            }
            // 解析对应的权限以及用户信息
            String uuid = (String) claims.get(Constants.LOGIN_USER_KEY);
            return getLoginUserUUid(uuid);
        }
        return null;
    }

    /**
     * 获取用户uuid
     *
     * @param uuid uuid
     * @return 用户信息
     */
    public LoginUser getLoginUserUUid(String uuid) {
        String userKey = getTokenKey(uuid);
        return redisTemplate.opsForValue().get(userKey);
    }


    /**
     * 设置用户身份信息
     */
    public void setLoginUser(LoginUser loginUser) {
        if (!ObjectUtils.isEmpty(loginUser) && !StrUtil.isEmpty(loginUser.getUuid())) {
            refreshToken(loginUser);
        }
    }

    /**
     * 删除用户身份信息
     */
    public void delLoginUser(String token) {
        if (!StrUtil.isEmpty(token)) {
            String userKey = getTokenKey(token);
            redisTemplate.delete(userKey);
        }
    }

    /**
     * 创建令牌
     *
     * @param loginUser 用户信息
     * @return 令牌
     */
    public String createToken(LoginUser loginUser) {
        refreshToken(loginUser);
        Map<String, Object> claims = new HashMap<>(1);
        claims.put(Constants.LOGIN_USER_KEY, loginUser.getUuid());
        return createToken(claims);
    }


    /**
     * 验证令牌有效期，相差不足20分钟，自动刷新缓存
     *
     * @param loginUser 用户信息
     */
    public void verifyToken(LoginUser loginUser) {
        long expireTime = loginUser.getExpireTime();
        long currentTime = System.currentTimeMillis();
        if (expireTime - currentTime <= MILLIS_MINUTE_TEN) {
            refreshToken(loginUser);
        }
    }

    /**
     * 刷新令牌有效期
     *
     * @param loginUser 登录信息
     */
    public void refreshToken(LoginUser loginUser) {
        loginUser.setLoginTime(System.currentTimeMillis());
        loginUser.setExpireTime(loginUser.getLoginTime() + expireTime * MILLIS_MINUTE);
        // 根据uuid将loginUser缓存
        String userKey = getTokenKey(loginUser.getUuid());
        redisTemplate.opsForValue().set(userKey, loginUser, expireTime, TimeUnit.MINUTES);
    }


    /**
     * 从数据声明生成令牌
     *
     * @param claims 数据声明
     * @return 令牌
     */
    private String createToken(Map<String, Object> claims) {
        return Jwts.builder()
                .setClaims(claims)
                .signWith(SignatureAlgorithm.HS512, secret).compact();
    }

    /**
     * 从令牌中获取数据声明
     *
     * @param token 令牌
     * @return 数据声明
     */
    private Claims parseToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException("token过期", 401);
        }
    }


    /**
     * 获取请求token
     *
     * @param request 请求对象
     * @return token 令牌信息
     */
    public String getToken(HttpServletRequest request) {
        String token = request.getHeader(header);
        if (!StrUtil.isEmpty(token) && token.startsWith(Constants.TOKEN_PREFIX)) {
            token = token.replace(Constants.TOKEN_PREFIX, "");
        }
        if ("null".equals(token)) {
            return null;
        }
        return token;
    }

    /**
     * 获取token
     *
     * @return 令牌信息
     */
    public String getToken() {
        return getToken(getRequest());
    }

    /**
     * 获取request请求体
     *
     * @return 请求体
     */
    public HttpServletRequest getRequest() {
        return HttpServletUtils.getRequest();
    }

    /**
     * token在获取header中的名称
     *
     * @return 获取header的名称
     */
    public String getHeader() {
        return header;
    }

    /**
     * 拼接用户信息在redis中的key
     *
     * @param uuid uuid
     * @return 获取到令牌在redis中的key
     */
    private String getTokenKey(String uuid) {
        return CacheConstants.LOGIN_TOKEN_KEY + uuid;
    }


    public void setHeader(String header) {
        this.header = header;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public void setExpireTime(long expireTime) {
        this.expireTime = expireTime;
    }
}
