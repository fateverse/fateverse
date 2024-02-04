package cn.fateverse.admin.vo;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

/**
 * @author Clay
 * @date 2022/10/30
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RouterVo implements Serializable {
    /**
     * 路由名字
     */
    private String name;

    /**
     * 路由地址
     */
    private String path;
    /**
     * 路径参数
     */
    private String pathParams;

    /**
     * 是否隐藏路由，当设置 true 的时候该路由不会再侧边栏出现
     */
    private boolean hidden;

    /**
     * 重定向地址，当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
     */
    @JsonInclude(NON_NULL)
    private String redirect;

    /**
     * 组件地址
     */
    private String component;

    /**
     * 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
     */
    @JsonInclude(NON_NULL)
    private Boolean alwaysShow;

    /**
     * 其他元素
     */
    private MetaVo meta;

    /**
     * 子路由
     */
    @JsonInclude(NON_NULL)
    private List<RouterVo> children;
}
