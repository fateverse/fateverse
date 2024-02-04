package cn.fateverse.common.file.service.impl;

import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.file.entity.FileInfo;
import cn.fateverse.common.file.service.FileStoreService;
import cn.fateverse.common.file.service.MinioFileService;
import cn.fateverse.common.file.utils.FileStoreServiceUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

/**
 * minio 对象存储实现类
 *
 * @author Clay
 * @date 2023-02-16
 */
@Slf4j
public class MinioFileStoreService implements FileStoreService {

    private final MinioFileService minioFileService;

    private final String bucket;

    public MinioFileStoreService(MinioFileService minioFileService) {
        this.minioFileService = minioFileService;
        this.bucket = minioFileService.getBucket();
    }

    @Override
    public Boolean createBucket(String bucketName) {
        return minioFileService.createBucket(bucketName);
    }

    @Override
    public Boolean deleteBucket(String bucketName) {
        return minioFileService.deleteBucket(bucketName);
    }

    @Override
    public FileInfo upload(MultipartFile file) {
        return upload(bucket, file);
    }

    @Override
    public FileInfo upload(String bucket, MultipartFile file) {
        // 上传文件流
        FileInfo fileInfo = FileStoreServiceUtil.getOssFile(file);
        boolean upload = minioFileService.upload(bucket, file, fileInfo);
        if (!upload) {
            throw new CustomException("文件上传失败!");
        }
        String url = minioFileService.getEndpoint() + "/" + bucket + "/" + fileInfo.getUri();
        fileInfo.setUrl(url);
        return fileInfo;
    }

    @Override
    public FileInfo upload(InputStream file, String fileName) {
        // 上传文件流
        FileInfo fileInfo = FileStoreServiceUtil.getFileInfo(file, fileName);
        boolean upload = minioFileService.upload(bucket, file, fileInfo);
        if (!upload) {
            throw new CustomException("文件上传失败!");
        }
        String url = minioFileService.getEndpoint() + "/" + bucket + "/" + fileInfo.getUri();
        fileInfo.setUrl(url);
        return fileInfo;
    }

    @Override
    public FileInfo upload(String bucket, InputStream file, String fileName) {
        return null;
    }

    @Override
    public InputStream download(String fileUri) {
        return minioFileService.getStream(bucket, fileUri);
    }

    @Override
    public InputStream download(String bucket, String fileUri) {
        return minioFileService.getStream(bucket, fileUri);
    }

    @Override
    public Boolean delete(String fileUri) {
        return minioFileService.delete(bucket, fileUri);
    }

    @Override
    public Boolean delete(String bucket, String fileUri) {
        return minioFileService.delete(bucket, fileUri);
    }
}
