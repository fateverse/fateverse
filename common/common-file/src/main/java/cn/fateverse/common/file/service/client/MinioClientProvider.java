package cn.fateverse.common.file.service.client;

import io.minio.MinioClient;

/**
 * minIO 客户端 provider
 * @author Clay
 * @date 2023-02-17
 */
public interface MinioClientProvider {

    /**
     * 获取一个MinioClient
     * @param endpoint 端点
     * @param accessKey accessKey
     * @param secretKey secretKey
     * @return MinioClient
     */
    MinioClient getClient(String endpoint, String accessKey, String secretKey);

}
