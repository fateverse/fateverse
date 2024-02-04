package cn.fateverse.common.security.utils;

import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.utils.HttpServletUtils;
import cn.fateverse.common.security.entity.LoginUser;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.servlet.http.HttpServletResponse;
import java.util.Objects;
import java.util.Set;

/**
 * 安全服务工具类
 *
 * @author Clay
 * @date 2022/10/29
 */
public class SecurityUtils {

    public static Long getUserId() {
        try {
            return getLoginUser().getUser().getUserId();
        } catch (Exception e) {
            throw new CustomException("获取用户账户异常", HttpStatus.UNAUTHORIZED.value());
        }
    }

    /**
     * 获取到用户权限信息
     *
     * @return 用户权限信息
     */
    public static Set<String> getPermissions() {
        try {
            return Objects.requireNonNull(getLoginUser()).getPermissions();
        } catch (Exception e) {
            return null;
        }
    }


    /**
     * 获取用户名
     *
     * @return 用户名
     */
    public static String getUsername() {
        try {
            return getLoginUser().getUsername();
        } catch (Exception e) {
            throw new CustomException("获取用户账户异常", HttpStatus.UNAUTHORIZED.value());
        }
    }

    /**
     * 获取登录用户信息
     *
     * @return 登录用户信息
     */
    public static LoginUser getLoginUser() {
        try {
            return (LoginUser) getAuthentication().getPrincipal();
        } catch (Exception e) {
            return null;
        }
    }


    /**
     * 获取当前线程Authentication
     *
     * @return 授权对象
     */
    public static Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    /**
     * 生成BCryptPasswordEncoder密码
     *
     * @param password 密码
     * @return 加密字符串
     */
    public static String encryptPassword(String password) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.encode(password);
    }

    /**
     * 判断密码是否相同
     *
     * @param rawPassword     真实密码
     * @param encodedPassword 加密后字符
     * @return 结果
     */
    public static boolean matchesPassword(String rawPassword, String encodedPassword) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    /**
     * todo 是否为管理员,还需要进行角色的校验
     *
     * @param userId 用户ID
     * @return 结果
     */
    public static boolean isAdmin(Long userId) {
        return userId != null && 1L == userId;
    }

    /**
     * 是否为管理员
     *
     * @return 管理状态
     */
    public static boolean isAdmin() {
        return isAdmin(getUserId());
    }

    /**
     * 获取http响应对象
     *
     * @return response
     */
    public static HttpServletResponse getResponse() {
        return HttpServletUtils.getResponse();
    }
}
