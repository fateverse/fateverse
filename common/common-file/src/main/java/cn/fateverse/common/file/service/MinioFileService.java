package cn.fateverse.common.file.service;

import cn.fateverse.common.file.service.client.MinioClientProvider;
import cn.fateverse.common.file.config.MinioProperties;
import cn.fateverse.common.file.entity.FileInfo;
import cn.fateverse.common.file.utils.FileStoreServiceUtil;
import io.minio.*;
import io.minio.errors.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

/**
 * 使用minio的api实现文件的存储获取等功能
 *
 * @author Clay
 * @date 2023-02-17
 */

@Slf4j
public class MinioFileService {

    @Autowired
    private MinioProperties properties;

    @Autowired
    private MinioClientProvider clientProvider;

    private String endpoint;
    private String bucket;
    private String accessKey;
    private String secretKey;

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
        this.accessKey = properties.getAccessKey();
        this.secretKey = properties.getSecretKey();
    }

    /**
     * 获取 minio 连接客户端
     *
     * @return minio客户端
     */
    private MinioClient connect() {
        MinioClient minioClient = clientProvider.getClient(endpoint, accessKey, secretKey);
        log.debug("Got the client to minIO server {}.", endpoint);
        return minioClient;
    }

    /**
     * 创建桶
     *
     * @param bucketName 桶名
     * @return 是否创建成功
     */
    public boolean createBucket(String bucketName) {
        try {
            MinioClient minioClient = connect();
            if (!minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build())) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }
            return true;
        } catch (InvalidResponseException | ErrorResponseException | InsufficientDataException | InternalException |
                 InvalidKeyException | IOException | NoSuchAlgorithmException | ServerException |
                 XmlParserException e) {
            log.error("error: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 删除桶
     *
     * @param bucketName 桶名
     * @return 是否删除成功
     */
    public boolean deleteBucket(String bucketName) {
        try {
            MinioClient minioClient = connect();
            if (minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build())) {
                minioClient.removeBucket(RemoveBucketArgs.builder().bucket(bucketName).build());
            }
            return true;
        } catch (InsufficientDataException | ErrorResponseException | InternalException | InvalidKeyException |
                 InvalidResponseException | IOException | NoSuchAlgorithmException | ServerException |
                 XmlParserException e) {
            log.error("error: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 文件上传
     *
     * @param file     文件对象
     * @param fileInfo 文件信息
     * @return 是否上传成功
     */
    public boolean upload(MultipartFile file, FileInfo fileInfo) {
        return upload(bucket, file, fileInfo);
    }

    /**
     * 上传文件
     *
     * @param bucket   桶
     * @param file     文件对象
     * @param fileInfo 文件信息
     * @return 是否上传成功
     */
    public boolean upload(String bucket, MultipartFile file, FileInfo fileInfo) {
        Map<String, String> headers = new HashMap<>();
        if (fileInfo.getIsImage()) {
            headers.put("Content-Type", "image/jpg");
        }
        return upload(bucket, file, fileInfo, headers);
    }

    /**
     * 文件上传
     *
     * @param file     文件对象
     * @param fileInfo 文件信息
     * @return 是否上传成功
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
     * @return 是否上传成功
     */
    public boolean upload(String bucket, InputStream file, FileInfo fileInfo) {
        return upload(bucket, file, fileInfo, new HashMap<>());
    }

    public boolean upload(String bucket, MultipartFile file, FileInfo fileInfo, Map<String, String> headers) {
        try {
            return upload(bucket, file.getInputStream(), fileInfo, headers);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * @param bucket   桶
     * @param file     文件对象
     * @param fileInfo 文件信息
     * @param headers  头部信息
     * @return 是否上传成功
     */
    public boolean upload(String bucket, InputStream file, FileInfo fileInfo, Map<String, String> headers) {
        if (bucket == null || bucket.length() <= 0) {
            log.error("Bucket name cannot be blank.");
            return false;
        }
        try {
            MinioClient minioClient = connect();
            checkBucket(minioClient, bucket);
            minioClient.putObject(PutObjectArgs.builder().bucket(bucket).object(fileInfo.getUri())
                    .contentType(headers.get("Content-Type"))
                    .headers(headers).stream(file, file.available(), -1).build());
            if (fileInfo.getIsImage()) {
                byte[] thumbnailBytes = FileStoreServiceUtil.thumbnail(file, fileInfo);
                minioClient.putObject(PutObjectArgs.builder().bucket(bucket).object(fileInfo.getPath() + "/" + fileInfo.getThumbnailFileName())
                        .stream(new ByteArrayInputStream(thumbnailBytes), thumbnailBytes.length, -1)
                        .contentType(headers.get("Content-Type"))
                        .headers(headers).build());
            }
            return true;
        } catch (ServerException | InsufficientDataException | ErrorResponseException | NoSuchAlgorithmException |
                 IOException | InvalidKeyException | InvalidResponseException | XmlParserException |
                 InternalException e) {
            log.error("error: {}", e.getMessage());
            return false;
        }
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
        try {
            MinioClient minioClient = connect();
            minioClient.removeObject(RemoveObjectArgs.builder().bucket(bucket).object(fileName).build());
            return true;
        } catch (InvalidResponseException | ErrorResponseException | InsufficientDataException | InternalException |
                 InvalidKeyException | IOException | NoSuchAlgorithmException | ServerException |
                 XmlParserException e) {
            log.error("error: {}", e.getMessage());
            return false;
        }
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
        try {
            MinioClient minioClient = connect();
            return minioClient.getObject(GetObjectArgs.builder().bucket(bucket).object(fileName).build());

        } catch (InvalidResponseException | ErrorResponseException | InsufficientDataException | InternalException |
                 InvalidKeyException | IOException | NoSuchAlgorithmException | ServerException |
                 XmlParserException e) {
            log.error("error: {}", e.getMessage());
            return null;
        }
    }

    private void checkBucket(MinioClient minioClient, String bucket) throws ServerException, InsufficientDataException,
            ErrorResponseException, IOException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException,
            XmlParserException, InternalException {
        boolean isExist = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
        if (isExist) {
            log.info("Bucket {} already exists.", bucket);
        } else {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
        }
    }

}
