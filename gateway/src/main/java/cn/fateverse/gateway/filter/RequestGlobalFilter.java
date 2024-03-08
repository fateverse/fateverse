package cn.fateverse.gateway.filter;

import cn.fateverse.common.core.utils.IpBackUtils;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.gateway.util.IpUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


/**
 * @author Clay
 * @date 2022/10/27
 */
@Slf4j
@Component
public class RequestGlobalFilter implements GlobalFilter, Ordered {

    private final RedisTemplate<String, String> redisTemplate;

    public RequestGlobalFilter(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }


    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String remoteAddress = IpUtils.getIP(request);
        log.info("Method:{{}} Host:{{}} 远程ip:{{}} Path:{{}} Query:{{}}", request.getMethod().name(), request.getURI().getHost(), remoteAddress, request.getURI().getPath(), request.getQueryParams());
        Boolean flag = redisTemplate.opsForSet().isMember(IpBackUtils.BLACK_LIST_IP, remoteAddress);
        if (flag != null && flag) {
            return errorInfo(exchange, Result.error(HttpStatus.NETWORK_AUTHENTICATION_REQUIRED, "ip为黑名单,无权访问"));
        }
        return chain.filter(exchange);
    }


    /**
     * 返回response
     *
     * @param exchange
     * @param result
     * @return
     */
    public static Mono<Void> errorInfo(ServerWebExchange exchange, Result<String> result) {
        // 自定义返回格式
        return Mono.defer(() -> {
            byte[] bytes;
            try {
                bytes = new ObjectMapper().writeValueAsBytes(result);
            } catch (JsonProcessingException e) {
                log.error("网关响应异常：", e);
                throw new CustomException("信息序列化异常");
            } catch (Exception e) {
                log.error("网关响应异常：", e);
                throw new CustomException("写入响应异常");
            }
            ServerHttpResponse response = exchange.getResponse();
            response.getHeaders().add("Content-Type", MediaType.APPLICATION_JSON_VALUE);
            response.setStatusCode(result.getStatus());
            DataBuffer buffer = response.bufferFactory().wrap(bytes);
            return response.writeWith(Flux.just(buffer));
        });
    }


    @Override
    public int getOrder() {
        return 0;
    }
}
