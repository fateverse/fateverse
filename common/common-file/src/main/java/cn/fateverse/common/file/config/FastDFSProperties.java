package cn.fateverse.common.file.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.ObjectUtils;

@ConfigurationProperties(prefix = "fdfs")
public class FastDFSProperties {


    private String bucket;


    public String getBucket() {
        return ObjectUtils.isEmpty(bucket) ? "group1" : bucket;
    }

    public void setBucket(String bucket) {
        this.bucket = bucket;
    }
}
