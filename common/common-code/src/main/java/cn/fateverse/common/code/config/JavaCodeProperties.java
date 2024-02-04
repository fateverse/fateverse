package cn.fateverse.common.code.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author Clay
 * @date 2023-10-30  23:09
 */
@ConfigurationProperties(prefix = "code.java")
public class JavaCodeProperties {

    private String classPath;

    public String getClassPath() {
        return classPath;
    }

    public void setClassPath(String classPath) {
        this.classPath = classPath;
    }
}
