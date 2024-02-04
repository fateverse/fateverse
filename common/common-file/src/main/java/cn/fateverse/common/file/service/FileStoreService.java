package cn.fateverse.common.file.service;

import cn.fateverse.common.file.entity.FileInfo;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

/**
 * 文件存储服务接口类
 *
 * @author Clay
 * @date 2023-02-16
 */
public interface FileStoreService {

    /**
     * 创建文件桶
     *
     * @param bucketName 桶名
     * @return 创建结果
     */
    Boolean createBucket(String bucketName);

    /**
     * 删除文件桶
     *
     * @param bucketName 桶名
     * @return 删除结果
     */
    Boolean deleteBucket(String bucketName);

    /**
     * 上传文件
     *
     * @param file 文件对象
     * @return FileInfo对象
     */
    FileInfo upload(MultipartFile file);

    /**
     * 上传文件
     *
     * @param bucket 文件桶名
     * @param file   文件对象
     * @return FileInfo对象
     */
    FileInfo upload(String bucket, MultipartFile file);

    /**
     * 上传文件
     *
     * @param file 文件对象
     * @return FileInfo对象
     */
    FileInfo upload(InputStream file, String fileName);

    /**
     * 上传文件
     *
     * @param bucket 文件桶名
     * @param file   文件对象
     * @return FileInfo对象
     */
    FileInfo upload(String bucket, InputStream file, String fileName);

    /**
     * 下载文件
     *
     * @param fileUri 文件的资源定位符
     * @return 文件流
     */
    InputStream download(String fileUri);

    /**
     * 下载文件
     *
     * @param bucket  文件桶名
     * @param fileUri 文件的资源定位符
     * @return 文件流
     */
    InputStream download(String bucket, String fileUri);

    /**
     * 删除文件
     *
     * @param fileUri 文件的资源定位符
     * @return 删除状态
     */
    Boolean delete(String fileUri);

    /**
     * 删除文件
     *
     * @param bucket  文件桶名
     * @param fileUri 文件的资源定位符
     * @return 删除状态
     */
    Boolean delete(String bucket, String fileUri);
}
