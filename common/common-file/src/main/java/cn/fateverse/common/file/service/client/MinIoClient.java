package cn.fateverse.common.file.service.client;

import io.minio.MinioClient;
import lombok.extern.slf4j.Slf4j;

/**
 * @author Clay
 * @date 2023-02-17
 */
@Slf4j
public class MinIoClient implements MinioClientProvider {

    private volatile MinioClient minioClient = null;


    @Override
    public MinioClient getClient(String endpoint, String accessKey, String secretKey) {
        if (null == minioClient) {
            synchronized (MinIoClient.class) {
                if (null == minioClient) {
                    minioClient = new MinioClient.Builder().credentials(accessKey, secretKey).endpoint(endpoint).build();
                }
            }
        }
        return minioClient;
    }
}
