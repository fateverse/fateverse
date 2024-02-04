package cn.fateverse.common.file.service.impl;

import cn.fateverse.common.file.entity.FileInfo;
import cn.fateverse.common.file.service.FTPFileService;
import cn.fateverse.common.file.service.FileStoreService;
import cn.fateverse.common.file.utils.FileStoreServiceUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

/**
 * ftp文件上传
 *
 * @author Clay
 * @date 2023-03-15
 */
@Slf4j
public class FTPFileStoreService implements FileStoreService {

    private final FTPFileService ftpFileService;

    private final String asset;

    private final String bucket = "pub";

    public FTPFileStoreService(FTPFileService ftpFileService) {
        this.ftpFileService = ftpFileService;
        this.asset = ftpFileService.getAsset();
    }

    @Override
    public Boolean createBucket(String bucketName) {
        return null;
    }

    @Override
    public Boolean deleteBucket(String bucketName) {
        return null;
    }

    @Override
    public FileInfo upload(MultipartFile file) {
        return upload(bucket, file);
    }

    @Override
    public FileInfo upload(String bucket, MultipartFile file) {
        FileInfo fileInfo = FileStoreServiceUtil.getOssFile(file);
        ftpFileService.upload(bucket, file, fileInfo);
        if (bucket.equals("pub")) {
            String url = asset + "/" + fileInfo.getUri();
            fileInfo.setUrl(url);
        }
        return fileInfo;
    }

    @Override
    public FileInfo upload(InputStream file, String fileName) {
        return upload(bucket, file, fileName);
    }

    @Override
    public FileInfo upload(String bucket, InputStream file, String fileName) {
        FileInfo fileInfo = FileStoreServiceUtil.getFileInfo(file, fileName);
        ftpFileService.upload(bucket, file, fileInfo);
        if (bucket.equals("pub")) {
            String url = asset + "/" + fileInfo.getUri();
            fileInfo.setUrl(url);
        }
        return fileInfo;
    }

    @Override
    public InputStream download(String fileUri) {
        // 获取oss的Bucket名称
        return ftpFileService.getStream(bucket, fileUri);
    }

    @Override
    public InputStream download(String bucket, String fileUri) {
        return download(fileUri);
    }

    @Override
    public Boolean delete(String fileUri) {
        return delete(bucket, fileUri);
    }

    @Override
    public Boolean delete(String bucket, String fileUri) {
        return ftpFileService.delete(bucket, fileUri);
    }
}
