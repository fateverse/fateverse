package cn.fateverse.common.security.configure.properties;


import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;

import java.util.Set;

/**
 * demo开关配置
 */
@RefreshScope
@ConfigurationProperties(prefix = "demo.switch")
public class DemoSwitchProperties {

    private Boolean enable = false;


    private Set<String> excludeIdentifier;


    public Boolean getEnable() {
        return enable;
    }

    public void setEnable(Boolean enable) {
        this.enable = enable;
    }

    public Set<String> getExcludeIdentifier() {
        return excludeIdentifier;
    }

    public void setExcludeIdentifier(Set<String> excludeIdentifier) {
        this.excludeIdentifier = excludeIdentifier;
    }
}
