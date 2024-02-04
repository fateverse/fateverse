package cn.fateverse.common.file.service.client;

import com.aliyun.oss.OSSClient;

/**
 * 阿里云 客户端 provider
 * @author Clay
 * @date 2023-02-17
 */
public interface AliyunClientProvider {

    /**
     * 获取一个阿里云iss
     * @param endpoint 端点
     * @param accessKey accessKey
     * @param secretKey secretKey
     * @return OSS
     */
    OSSClient getClient(String endpoint, String accessKey, String secretKey);
}
