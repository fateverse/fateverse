package cn.fateverse.common.swagger.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;

/**
 * swagger
 *
 * @author Clay
 * @date 2022/10/31
 */
@RefreshScope
@ConfigurationProperties(prefix = "swagger")
public class SwaggerProperties {

    @Value("${token.header}")
    private String header;

    /**
     * title
     */
    private String title;

    /**
     * 版本号
     */
    private String version;

    /**
     * 是否开启swagger
     */
    private boolean enabled;

    /**
     * swagger文档描述
     */
    private String description;


    public String getHeader() {
        return header;
    }

    public void setHeader(String header) {
        this.header = header;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
