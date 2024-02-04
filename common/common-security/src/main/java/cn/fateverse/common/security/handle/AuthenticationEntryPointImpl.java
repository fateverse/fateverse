package cn.fateverse.common.security.handle;

import cn.hutool.core.text.StrFormatter;
import cn.fateverse.common.core.result.Result;
import com.alibaba.fastjson2.JSON;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.Serializable;

/**
 * 认证失败处理类 返回未授权
 *
 * @author Clay
 * @date 2022/10/27
 */
public class AuthenticationEntryPointImpl implements AccessDeniedHandler, AuthenticationEntryPoint, Serializable {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException e) {
        accessDenied(request, response);
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) {
        accessDenied(request, response);
    }


    public void accessDenied(HttpServletRequest request, HttpServletResponse response) {
        String msg = StrFormatter.format("请求访问：{}，认证失败，无法访问系统资源", request.getRequestURI());
        renderString(response,Result.unauthorized(msg));
    }


    /**
     * 将字符串渲染到客户端
     *
     * @param response 渲染对象
     * @param result   返回的错误对象
     */
    public static void renderString(HttpServletResponse response, Result<String> result) {
        try {
            response.setStatus(result.getStatus().value());
            response.setContentType("application/json");
            response.setCharacterEncoding("utf-8");
            response.getWriter().print(JSON.toJSONString(result));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
