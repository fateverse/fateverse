package cn.fateverse.common.file.service.impl;

import cn.fateverse.common.file.config.FastDFSProperties;
import cn.fateverse.common.file.entity.FileInfo;
import cn.fateverse.common.file.service.FileStoreService;
import cn.fateverse.common.file.utils.FileStoreServiceUtil;
import com.github.tobato.fastdfs.domain.conn.FdfsWebServer;
import com.github.tobato.fastdfs.domain.fdfs.StorePath;
import com.github.tobato.fastdfs.domain.upload.FastFile;
import com.github.tobato.fastdfs.domain.upload.FastImageFile;
import com.github.tobato.fastdfs.domain.upload.ThumbImage;
import com.github.tobato.fastdfs.service.FastFileStorageClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.IOException;
import java.io.InputStream;


@Slf4j
public class FastDFSStoreService implements FileStoreService {

    @Resource
    private FastDFSProperties properties;
    @Resource
    private FastFileStorageClient storageClient;

    @Resource
    private FdfsWebServer fdfsWebServer;


    @Override
    public Boolean createBucket(String bucketName) {
        return false;
    }

    @Override
    public Boolean deleteBucket(String bucketName) {
        return false;
    }

    @Override
    public FileInfo upload(MultipartFile file) {
        FileInfo fileInfo = FileStoreServiceUtil.getOssFile(file);
        try {
            return upload(file.getInputStream(), fileInfo, properties.getBucket());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    @Override
    public FileInfo upload(String bucket, MultipartFile file) {
        FileInfo fileInfo = FileStoreServiceUtil.getOssFile(file);
        try {
            return upload(file.getInputStream(), fileInfo, bucket);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public FileInfo upload(InputStream file, String fileName) {
        FileInfo fileInfo = FileStoreServiceUtil.getFileInfo(file, fileName);
        return upload(file, fileInfo, properties.getBucket());
    }

    @Override
    public FileInfo upload(String bucket, InputStream file, String fileName) {
        FileInfo fileInfo = FileStoreServiceUtil.getFileInfo(file, fileName);
        return upload(file, fileInfo, bucket);
    }


    private FileInfo upload(InputStream file, FileInfo fileInfo, String bucket) {
        try {
            StorePath storePath;
            if (fileInfo.getIsImage()) {
                FastImageFile fastImageFile = new FastImageFile.Builder()
                        .toGroup(bucket)
                        .withThumbImage()
                        .withFile(file, fileInfo.getSize(), fileInfo.getFileType())
                        .build();
                storePath = storageClient.uploadImage(fastImageFile);
                setPath(fileInfo, storePath);
                ThumbImage thumbImage = fastImageFile.getThumbImage();
                String prefixName = thumbImage.getPrefixName();
                String fileName = fileInfo.getFileName().substring(0, fileInfo.getFileName().lastIndexOf("."));
                String thumbnailFileName = fileName + prefixName + "." + fileInfo.getFileType();
                fileInfo.setThumbnailFileName(thumbnailFileName);
                String thumbnailUri = fdfsWebServer.getWebServerUrl() + "/" + properties.getBucket() + "/" + fileInfo.getPath() + "/" + thumbnailFileName;
                fileInfo.setThumbnailUri(thumbnailUri);
            } else {
                FastFile fastFile = new FastFile.Builder()
                        .toGroup(bucket)
                        .withFile(file, fileInfo.getSize(), fileInfo.getFileType())
                        .build();
                storePath = storageClient.uploadFile(fastFile);
                setPath(fileInfo, storePath);
            }
            return fileInfo;

        } catch (Exception e) {
            log.error("文件上传失败", e);
            throw new RuntimeException("文件上传失败");
        }
    }


    private void setPath(FileInfo fileInfo, StorePath storePath) {
        String path = storePath.getPath();
        String[] split = path.split("/");
        String fileName = split[split.length - 1];
        fileInfo.setUri(path);
        fileInfo.setFileName(fileName);
        String url = getResAccessUrl(storePath);
        fileInfo.setUrl(url);
        fileInfo.setPath(path.substring(0, path.lastIndexOf("/")));
    }

    @Override
    public InputStream download(String fileUri) {
        return download(properties.getBucket(), fileUri);
    }

    @Override
    public InputStream download(String bucket, String fileUri) {
        return storageClient.downloadFile(bucket, fileUri, ins -> ins);
    }

    @Override
    public Boolean delete(String fileUri) {
        return delete(properties.getBucket(), fileUri);
    }

    @Override
    public Boolean delete(String bucket, String fileUri) {
        storageClient.deleteFile(bucket, fileUri);
        return Boolean.TRUE;
    }

    /**
     * 封装图片完整URL地址
     */
    private String getResAccessUrl(StorePath storePath) {
        return fdfsWebServer.getWebServerUrl() + storePath.getFullPath();
    }
}
