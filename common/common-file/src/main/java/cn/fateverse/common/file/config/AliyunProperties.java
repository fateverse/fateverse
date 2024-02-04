package cn.fateverse.common.file.config;


import org.springframework.boot.context.properties.ConfigurationProperties;


/**
 * 阿里云 配置文件信息
 *
 * @author Clay
 * @date 2023/1/10
 */
@ConfigurationProperties(prefix = "file.store.aliyun")
public class AliyunProperties {

    /**
     * 地域节点
     */
    private String endpoint;
    private String accessKeyId;
    private String secretAccessKey;
    /**
     * OSS的Bucket名称
     */
    private String bucket;

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

    public String getAccessKeyId() {
        return accessKeyId;
    }

    public void setAccessKeyId(String accessKeyId) {
        this.accessKeyId = accessKeyId;
    }

    public String getSecretAccessKey() {
        return secretAccessKey;
    }

    public void setSecretAccessKey(String secretAccessKey) {
        this.secretAccessKey = secretAccessKey;
    }

}
