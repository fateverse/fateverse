package cn.fateverse.common.security.filter;

import cn.fateverse.common.core.utils.ObjectUtils;
import cn.fateverse.common.security.service.TokenService;
import cn.fateverse.common.security.entity.LoginUser;
import cn.fateverse.common.security.utils.SecurityUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.annotation.Resource;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author Clay
 * @date 2022/10/27
 */
@Slf4j
public class AuthenticationTokenFilter extends OncePerRequestFilter {
    @Resource
    private TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String token = tokenService.getToken(request);
        if (!ObjectUtils.isEmpty(token)) {
            LoginUser loginUser = tokenService.getLoginUser(token);
            log.info("接口:{},被请求", request.getRequestURI());
            if (!ObjectUtils.isEmpty(loginUser) && ObjectUtils.isEmpty(SecurityUtils.getAuthentication())) {
                tokenService.verifyToken(loginUser);
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginUser, null, loginUser.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        chain.doFilter(request, response);
    }

}