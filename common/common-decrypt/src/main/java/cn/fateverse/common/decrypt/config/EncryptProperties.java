package cn.fateverse.common.decrypt.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author Clay
 * @date 2023-07-04
 */
@ConfigurationProperties(prefix = "encrypt")
public class EncryptProperties {

    private String secretKey;

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }
}
