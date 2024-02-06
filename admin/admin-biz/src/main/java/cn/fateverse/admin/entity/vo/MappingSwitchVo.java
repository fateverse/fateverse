package cn.fateverse.admin.entity.vo;

import cn.fateverse.common.security.entity.MappingSwitchInfo;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

/**
 * @author Clay
 * @date 2024/2/5 14:23
 */
@Data
@Builder
public class MappingSwitchVo {


    /**
     * key作为唯一编号
     */
    private String key;

    /**
     * 应用名称
     */
    private String applicationName;

    /**
     * 类名
     */
    private String className;

    /**
     * 方法名称
     */
    private String methodName;

    /**
     * 描述MappingSwitch注解的value可以为空
     */
    private String description;

    /**
     * HandlerMethod中的uri
     */
    private Set<String> uris;

    /**
     * 当前开关类型
     */
    private String type;

    /**
     * 当前方法请求类型
     */
    private Set<String> httpMethods;

    /**
     * 当前方法的状态,true为正常放行,false为关闭
     */
    private Boolean state;

    public static MappingSwitchVo toMappingSwitchVo(MappingSwitchInfo mappingSwitchInfo) {
        return MappingSwitchVo.builder()
                .key(mappingSwitchInfo.getKey())
                .applicationName(mappingSwitchInfo.getApplicationName())
                .className(mappingSwitchInfo.getClassName())
                .description(mappingSwitchInfo.getDescription())
                .methodName(mappingSwitchInfo.getMethodName())
                .uris(mappingSwitchInfo.getUris())
                .type(mappingSwitchInfo.getType().toString())
                .httpMethods(mappingSwitchInfo.getHttpMethods())
                .state(mappingSwitchInfo.getState())
                .build();
    }


}
