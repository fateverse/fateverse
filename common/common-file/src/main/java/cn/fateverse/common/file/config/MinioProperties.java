package cn.fateverse.common.file.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * minio 配置信息
 *
 * @author Clay
 * @date 2023-02-17
 */
@ConfigurationProperties(prefix = "file.store.minio")
public class MinioProperties {
    private String endpoint;
    private String bucket;
    private String accessKey;
    private String secretKey;

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getBucket() {
        return bucket;
    }

    public void setBucket(String bucket) {
        this.bucket = bucket;
    }

    public String getAccessKey() {
        return accessKey;
    }

    public void setAccessKey(String accessKey) {
        this.accessKey = accessKey;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }
}
