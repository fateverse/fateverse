package cn.fateverse.gateway.config;

import org.springframework.cloud.gateway.config.GatewayProperties;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.support.NameUtils;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import springfox.documentation.swagger.web.SwaggerResource;
import springfox.documentation.swagger.web.SwaggerResourcesProvider;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Binlin B Wang
 */
@Primary
@Component
public class CustomSwaggerResourceProvider implements SwaggerResourcesProvider {
    /**
     * Swagger2默认的url后缀
     */
    public static final String V_3_API_DOCS = "/v3/api-docs";
    /**
     * 网关路由
     */
    @Resource
    private RouteLocator routeLocator;
    @Resource
    private GatewayProperties gatewayProperties;


    /**
     * 聚合其他服务接口
     *
     * @return
     */
    @Override
    public List<SwaggerResource> get() {
        List<SwaggerResource> resourceList = new ArrayList<>();
        List<String> routes = new ArrayList<>();
        //获取网关中配置的route
        routeLocator.getRoutes().subscribe(route -> routes.add(route.getId()));
        gatewayProperties.getRoutes().stream().filter(routeDefinition -> routes.contains(routeDefinition.getId()))
                .forEach(routeDefinition -> routeDefinition.getPredicates().stream()
                        .filter(predicateDefinition -> "Path".equalsIgnoreCase(predicateDefinition.getName()))
                        .forEach(predicateDefinition -> resourceList.add(
                                swaggerResource(
                                        "服务名称:" + routeDefinition.getId() + "   请求路径前缀 : /" + routeDefinition.getId(),
                                        //routeDefinition.getId(),
                                        predicateDefinition
                                                .getArgs()
                                                .get(NameUtils.GENERATED_NAME_PREFIX + "0")
                                                .replace("/**", V_3_API_DOCS)))));
        return resourceList;
    }

    private SwaggerResource swaggerResource(String name, String location) {
        SwaggerResource swaggerResource = new SwaggerResource();
        swaggerResource.setName(name);
        swaggerResource.setLocation(location);
        swaggerResource.setUrl(location);
        swaggerResource.setSwaggerVersion("3.0");
        return swaggerResource;
    }


}