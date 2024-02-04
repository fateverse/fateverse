package cn.fateverse.auth.service.impl;

import cn.fateverse.auth.entity.UserInfo;
import cn.hutool.core.date.DateUtil;
import cn.fateverse.admin.dubbo.DubboMenuService;
import cn.fateverse.admin.dubbo.DubboUserService;
import cn.fateverse.admin.vo.RouterVo;
import cn.fateverse.auth.entity.LoginBody;
import cn.fateverse.auth.service.LoginService;
import cn.fateverse.admin.entity.Role;
import cn.fateverse.admin.entity.User;
import cn.fateverse.common.core.constant.CacheConstants;
import cn.fateverse.common.core.constant.DateConstants;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.exception.UserPasswordNotMatchException;
import cn.fateverse.common.core.utils.SpringContextHolder;
import cn.fateverse.common.core.utils.uuid.IdUtils;
import cn.fateverse.common.security.entity.LoginUser;
import cn.fateverse.common.security.service.TokenService;
import cn.fateverse.common.security.utils.SecurityUtils;
import cn.fateverse.common.log.event.LoginInfoEvent;
import cn.fateverse.common.log.utils.LoginInfoUtil;
import cn.fateverse.log.entity.LoginInfo;
import lombok.extern.slf4j.Slf4j;
import org.apache.dubbo.config.annotation.DubboReference;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * 登录service服务
 *
 * @author Clay
 * @date 2022/10/27
 */

@Slf4j
@Service
public class LoginServiceImpl implements LoginService {


    @Resource
    private AuthenticationManager authenticationManager;

    @Resource
    private TokenService tokenService;

    private final PermissionService permissionService;

    /**
     * 临时处理
     */
    @DubboReference
    private DubboUserService userService;

    @DubboReference
    private DubboMenuService menuService;

    @Resource
    private RedissonClient redissonClient;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;


    public LoginServiceImpl(PermissionService permissionService) {
        this.permissionService = permissionService;
    }


    @Override
    public String login(LoginBody login) {
        log.info("用户:{},于:{}登录系统", login.getUsername(), DateUtil.format(new Date(), DateConstants.YYYY_MM_DD_HH_MM_SS));
        String uuid = CacheConstants.CAPTCHA_CODE_KEY + login.getUuid();
        String code = String.valueOf(redisTemplate.opsForValue().get(uuid));
        if (null == code) {
            publishEvent(login.getUsername(), "验证码已过期!", Boolean.FALSE, null);
            throw new CustomException("验证码已过期!");
        }
        if (!code.equals(login.getCode())) {
            publishEvent(login.getUsername(), "验证码错误!", Boolean.FALSE, null);
            throw new CustomException("验证码错误!");
        }
        redisTemplate.delete(uuid);
         //用户验证
        Authentication authentication = null;
        try {
            // 该方法会去调用UserDetailsServiceImpl.loadUserByUsername
            authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(login.getUsername(), login.getPassword()));
        } catch (Exception e) {
            if (e instanceof BadCredentialsException) {
                throw new UserPasswordNotMatchException();
            } else {
                publishEvent(login.getUsername(), "登录失败,请联系管理员", Boolean.FALSE, null);
                throw new CustomException(e.getMessage());
            }
        }
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        permissionService.getMenuPermission(loginUser);
        loginUser.getUser().setPassword(null);
        String userUUId = IdUtils.fastUUID();
        loginUser.setUuid(userUUId);
        LoginInfo loginInfo = publishEvent(login.getUsername(), null, Boolean.TRUE, userUUId);
        setLoginInfo(loginUser, loginInfo);
        // 生成token
        return tokenService.createToken(loginUser);
    }

    @Override
    public void logout() {
        tokenService.userLogout();
    }

    /**
     * 设置登录的信息,比如操作系统浏览器等
     *
     * @param user
     * @param info
     */
    private void setLoginInfo(LoginUser user, LoginInfo info) {
        user.setLoginLocation(info.getLoginLocation());
        user.setLoginTime(System.currentTimeMillis());
        user.setIpddr(info.getIpddr());
        user.setBrowser(info.getBrowser());
        user.setOs(info.getOs());
    }


    @Override
    public UserInfo getInfo() {
        LoginUser loginUser = SecurityUtils.getLoginUser();
        User user = loginUser.getUser();
        Set<String> roleNameSet = user.getRoles().stream().map(Role::getRoleKey).collect(Collectors.toSet());
        user.setPassword(null);
        return UserInfo.builder()
                .user(user)
                .permissions(loginUser.getPermissions())
                .roles(roleNameSet)
                .build();
    }


    @Override
    public List<RouterVo> getMenuRouterByUserId() {
        List<RouterVo> result = (List<RouterVo>) redisTemplate.opsForValue().get(CacheConstants.ROUTE_CACHE_KEY + SecurityUtils.getUserId());
        if (result == null || result.isEmpty()) {
            RLock lock = redissonClient.getLock(CacheConstants.ROUTE_CACHE_KEY + "lock:" + SecurityUtils.getUserId());
            try {
                result = (List<RouterVo>) redisTemplate.opsForValue().get(CacheConstants.ROUTE_CACHE_KEY + SecurityUtils.getUserId());
                if (result == null || result.isEmpty()) {
                    result = menuService.selectMenuRouterByUserId(SecurityUtils.getUserId());
                    if (result == null || result.isEmpty()) {
                        log.info("用户:[{}],用户id:[{}],获取路由异常!", SecurityUtils.getUsername(), SecurityUtils.getUserId());
//                        throw new CustomException("获取路由异常!");
                        return new ArrayList<>();
                    }
                    redisTemplate.opsForValue().set(CacheConstants.ROUTE_CACHE_KEY + SecurityUtils.getUserId(),result,30, TimeUnit.MINUTES);
                }
            } finally {
                if (lock.isLocked() && lock.isHeldByCurrentThread()) {
                    lock.unlock();
                }
            }
        }
        return result;
    }

    /**
     * 统一的消息发布函数
     *
     * @param username
     * @param msg
     * @param start
     */
    private LoginInfo publishEvent(String username, String msg, Boolean start, String uuid) {
        LoginInfo loginInfo = null;
        if (start) {
            loginInfo = LoginInfoUtil.successLogin(username);
            loginInfo.setUuid(uuid);
        } else {
            loginInfo = LoginInfoUtil.successFail(username, msg);
        }
        SpringContextHolder.publishEvent(new LoginInfoEvent(loginInfo));
        return loginInfo;
    }

}
