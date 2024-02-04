package cn.fateverse.common.swagger.aspect;

import cn.hutool.core.util.StrUtil;
import cn.fateverse.common.core.utils.HttpServletUtils;
import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.util.UriComponents;
import springfox.documentation.spring.web.json.Json;
import springfox.documentation.swagger.common.HostNameProvider;

import javax.servlet.http.HttpServletRequest;


/**
 * @author Clay
 * @date 2023-05-07
 */
@Slf4j
@Aspect
public class SwaggerAspect {


    @SneakyThrows
    @Around("execution(* springfox.documentation.oas.web.OpenApiControllerWebMvc.getDocumentation(..))")
    public Object around(ProceedingJoinPoint point) {
        ResponseEntity<Json> proceed = (ResponseEntity<Json>) point.proceed();
        String value = proceed.getBody().value();
        JSONObject object = JSON.parseObject(value);
        HttpServletRequest request = HttpServletUtils.getRequest();
        JSONArray servers = object.getJSONArray("servers");
        String basePath = null;
        JSONObject server = servers.getJSONObject(0);
        String path = server.getString("url");
        UriComponents uriComponents = HostNameProvider.componentsFrom(request, path);
        basePath = StrUtil.isEmpty(uriComponents.getPath()) ? "/" : uriComponents.getPath();
        //server.put("url", path + basePath);
        object.put("basePath", basePath);
        return new ResponseEntity<>(object.toString(), HttpStatus.OK);
    }
}
