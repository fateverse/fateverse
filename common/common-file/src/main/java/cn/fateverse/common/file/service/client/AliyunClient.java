package cn.fateverse.common.file.service.client;

import com.aliyun.oss.ClientBuilderConfiguration;
import com.aliyun.oss.OSSClient;
import com.aliyun.oss.common.auth.DefaultCredentialProvider;

/**
 * @author Clay
 * @date 2023-02-17
 */
public class AliyunClient implements AliyunClientProvider{

    private volatile OSSClient ossClient = null;


    @Override
    public OSSClient getClient(String endpoint, String accessKeyId, String secretAccessKey) {
        if (ossClient == null){
            synchronized (AliyunClient.class){
                if (ossClient == null){
                    ossClient = new OSSClient(endpoint,getDefaultCredentialProvider(accessKeyId,secretAccessKey),getClientConfiguration());
                }
            }
        }
        return ossClient;
    }

    private static DefaultCredentialProvider getDefaultCredentialProvider(String accessKeyId, String secretAccessKey) {
        return new DefaultCredentialProvider(accessKeyId, secretAccessKey);
    }

    private static ClientBuilderConfiguration getClientConfiguration() {
        return new ClientBuilderConfiguration();
    }
}
