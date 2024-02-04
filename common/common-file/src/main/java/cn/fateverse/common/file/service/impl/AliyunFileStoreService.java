package cn.fateverse.common.file.service.impl;

import cn.fateverse.common.file.entity.FileInfo;
import cn.fateverse.common.file.service.AliyunFileService;
import cn.fateverse.common.file.service.FileStoreService;
import cn.fateverse.common.file.utils.FileStoreServiceUtil;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;


/**
 * aliyun 对象存储实现类
 *
 * @author Clay
 * @date 2023/1/10
 */
public class AliyunFileStoreService implements FileStoreService {

    private final AliyunFileService aliyunFileService;

    private final String bucket;

    public AliyunFileStoreService(AliyunFileService aliyunFileService) {
        this.aliyunFileService = aliyunFileService;
        this.bucket = aliyunFileService.getBucket();
    }

    @Override
    public Boolean createBucket(String bucketName) {
        return aliyunFileService.createBucket(bucketName);
    }

    @Override
    public Boolean deleteBucket(String bucketName) {
        return aliyunFileService.deleteBucket(bucketName);
    }

    public FileInfo upload(MultipartFile file) {
        // 获取oss的Bucket名称
        return upload(bucket, file);
    }


    @Override
    public FileInfo upload(String bucket, MultipartFile file) {
        // 获取oss目标文件夹
        FileInfo fileInfo = FileStoreServiceUtil.getOssFile(file);
        String uri = fileInfo.getUri();
        aliyunFileService.upload(bucket, file, fileInfo);
        String url = "https://" + bucket + "." + aliyunFileService.getEndpoint() + "/" + uri;
        fileInfo.setUrl(url);
        if (fileInfo.getIsImage()) {
            fileInfo.setThumbnailUri(fileInfo.getUri() + "?x-oss-process=image/resize,m_lfit,h_200,w_200");
            fileInfo.setThumbnailFileName(null);
        }
        return fileInfo;
    }

    @Override
    public FileInfo upload(InputStream file, String fileName) {
        return upload(bucket, file, fileName);
    }

    @Override
    public FileInfo upload(String bucket, InputStream file, String fileName) {
        // 获取oss目标文件夹
        FileInfo fileInfo = FileStoreServiceUtil.getFileInfo(file, fileName);
        String uri = fileInfo.getUri();
        aliyunFileService.upload(bucket, file, fileInfo);
        String url = "https://" + bucket + "." + aliyunFileService.getEndpoint() + "/" + uri;
        fileInfo.setUrl(url);
        if (fileInfo.getIsImage()) {
            fileInfo.setThumbnailUri(fileInfo.getUri() + "?x-oss-process=image/resize,m_lfit,h_200,w_200");
            fileInfo.setThumbnailFileName(null);
        }
        return fileInfo;
    }

    public InputStream download(String fileUri) {
        // 获取oss的Bucket名称
        return download(bucket, fileUri);
    }


    @Override
    public InputStream download(String bucket, String fileUri) {
        // ossObject包含文件所在的存储空间名称、文件名称、文件元信息以及一个输入流。
        return aliyunFileService.getStream(bucket, fileUri);
    }

    public Boolean delete(String fileUri) {
        // 获取oss的Bucket名称
        return delete(bucket, fileUri);
    }

    @Override
    public Boolean delete(String bucket, String fileUri) {
        aliyunFileService.delete(bucket, fileUri);
        return Boolean.TRUE;
    }

}
