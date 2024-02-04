package cn.fateverse.common.file.service;

import cn.fateverse.common.file.config.AliyunProperties;
import cn.fateverse.common.file.entity.FileInfo;
import cn.fateverse.common.file.service.client.AliyunClientProvider;
import com.aliyun.oss.OSSClient;
import com.aliyun.oss.model.ObjectMetadata;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;

/**
 * @author Clay
 * @date 2023-02-17
 */
@Slf4j
public class AliyunFileService {

    @Autowired
    private AliyunProperties properties;

    @Autowired
    private AliyunClientProvider clientProvider;

    private String endpoint;
    private String bucket;
    private String accessKeyId;
    private String secretAccessKey;

    public String getEndpoint() {
        return endpoint;
    }

    public String getBucket() {
        return bucket;
    }

    /**
     * 初始化字段信息
     */
    @PostConstruct
    private void init() {
        this.endpoint = properties.getEndpoint();
        this.bucket = properties.getBucket();
        this.accessKeyId = properties.getAccessKeyId();
        this.secretAccessKey = properties.getSecretAccessKey();
    }

    /**
     * 获取 阿里云oss 连接客户端
     *
     * @return 阿里云oss客户端
     */
    private OSSClient connect() {
        OSSClient ossClient = clientProvider.getClient(endpoint, accessKeyId, secretAccessKey);
        log.debug("Got the client to aliyun oss server {}.", endpoint);
        return ossClient;
    }

    /**
     * 创建桶
     *
     * @param bucketName 桶名
     * @return 是否创建成功
     */
    public boolean createBucket(String bucketName) {
        OSSClient ossClient = connect();
        if (!ossClient.doesBucketExist(bucketName)) {
            ossClient.createBucket(bucketName);
        }
        return true;
    }

    /**
     * 删除桶
     *
     * @param bucketName 桶名
     * @return 是否删除成功
     */
    public boolean deleteBucket(String bucketName) {
        OSSClient ossClient = connect();
        if (ossClient.doesBucketExist(bucketName)) {
            ossClient.deleteBucket(bucketName);
        }
        return true;
    }

    /**
     * 文件上传
     *
     * @param file     文件对象
     * @param fileInfo 文件信息
     * @return 上传成功后的文件对象
     */
    public boolean upload(MultipartFile file, FileInfo fileInfo) {
        return upload(bucket, file, fileInfo);
    }

    /**
     * 文件上传
     *
     * @param file     文件对象
     * @param fileInfo 文件信息
     * @return 上传成功后的文件对象
     */
    public boolean upload(InputStream file, FileInfo fileInfo) {
        return upload(bucket, file, fileInfo);
    }


    /**
     * 上传文件
     *
     * @param bucket   桶
     * @param file     文件对象
     * @param fileInfo 文件信息
     * @return 上传成功后的文件对象
     */
    public boolean upload(String bucket, MultipartFile file, FileInfo fileInfo) {
        ObjectMetadata meta = null;
        if (fileInfo.getIsImage()) {
            meta = new ObjectMetadata();
            meta.setContentType(file.getContentType());
        }
        return upload(bucket, file, fileInfo, meta);
    }


    /**
     * 上传文件
     *
     * @param bucket   桶
     * @param file     文件对象
     * @param fileInfo 文件信息
     * @return 上传成功后的文件对象
     */
    public boolean upload(String bucket, InputStream file, FileInfo fileInfo) {
        return upload(bucket, file, fileInfo, new ObjectMetadata());
    }


    /**
     * 上传文件
     *
     * @param bucket   桶
     * @param file     文件对象
     * @param fileInfo 文件信息
     * @param meta     头信息
     * @return 上传成功后的文件对象
     */
    public boolean upload(String bucket, MultipartFile file, FileInfo fileInfo, ObjectMetadata meta) {
        try {
            return upload(bucket, file.getInputStream(), fileInfo, meta);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean upload(String bucket, InputStream file, FileInfo fileInfo, ObjectMetadata meta) {
        if (bucket == null || bucket.length() <= 0) {
            log.error("Bucket name cannot be blank.");
            return false;
        }
        OSSClient ossClient = connect();
        checkBucket(ossClient, bucket);
        ossClient.putObject(bucket, fileInfo.getUri(), file, meta);
        return true;
    }


    /**
     * 删除文件
     *
     * @param fileName 文件名 (路径+文件名)
     * @return 是否删除成功
     */
    public boolean delete(String fileName) {
        return delete(bucket, fileName);
    }

    /**
     * 删除文件
     *
     * @param bucket   桶
     * @param fileName 文件名 (路径+文件名)
     * @return 是否删除成功
     */
    public boolean delete(String bucket, String fileName) {
        OSSClient ossClient = connect();
        ossClient.deleteObject(bucket, fileName);
        return true;
    }

    /**
     * 根据文件名获取文件流
     *
     * @param fileName 文件名 (路径+文件名)
     * @return 文件流
     */
    public InputStream getStream(String fileName) {
        return getStream(bucket, fileName);
    }

    /**
     * 根据文件名获取文件流
     *
     * @param bucket   桶
     * @param fileName 文件名 (路径+文件名)
     * @return 文件流
     */
    public InputStream getStream(String bucket, String fileName) {
        OSSClient ossClient = connect();
        return ossClient.getObject(bucket, fileName).getObjectContent();
    }


    private void checkBucket(OSSClient ossClient, String bucket) {
        boolean isExist = ossClient.doesBucketExist(bucket);
        if (isExist) {
            log.info("Bucket {} already exists.", bucket);
        } else {
            ossClient.createBucket(bucket);
        }
    }


}
