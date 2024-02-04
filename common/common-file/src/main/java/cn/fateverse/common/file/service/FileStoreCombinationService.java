package cn.fateverse.common.file.service;

import cn.fateverse.common.file.enums.FTLStoreServiceEnum;
import cn.fateverse.common.file.entity.FileInfo;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;

/**
 * 对象存储组合类,使用责任链模式,可以使用户通过服务类型指定对应的oss服务
 *
 * @author Clay
 * @date 2023-02-16
 */
public class FileStoreCombinationService {


    private final List<FileStoreService> fileStoreServiceList;

    public FileStoreCombinationService(List<FileStoreService> fileStoreServiceList) {
        this.fileStoreServiceList = fileStoreServiceList;
    }

    /**
     * 上传文件
     *
     * @param file        文件名称
     * @param serviceType 服务类型
     * @return 上传成功的oss文件对象
     */
    public FileInfo upload(MultipartFile file, FTLStoreServiceEnum serviceType) {
        for (FileStoreService fileStoreService : fileStoreServiceList) {
            if (fileStoreService.getClass().equals(serviceType.getType())) {
                return fileStoreService.upload(file);
            }
        }
        return null;
    }

    /**
     * 上传文件
     *
     * @param file        文件名称
     * @param serviceType 服务类型
     * @param bucket      文件桶名
     * @return 上传成功的oss文件对象
     */
    public FileInfo upload(String bucket, MultipartFile file, FTLStoreServiceEnum serviceType) {
        for (FileStoreService fileStoreService : fileStoreServiceList) {
            if (fileStoreService.getClass().equals(serviceType.getType())) {
                return fileStoreService.upload(bucket, file);
            }
        }
        return null;
    }

    /**
     * /**
     * 下载文件
     *
     * @param fileUri     文件的资源定位符
     * @param serviceType 服务类型
     * @return 文件流
     */
    public InputStream download(String fileUri, FTLStoreServiceEnum serviceType) {
        for (FileStoreService fileStoreService : fileStoreServiceList) {
            if (fileStoreService.getClass().equals(serviceType.getType())) {
                return fileStoreService.download(fileUri);
            }
        }
        return null;
    }

    /**
     * 下载文件
     *
     * @param fileUri     文件的资源定位符
     * @param bucket      文件桶名
     * @param serviceType 服务类型
     * @return 文件流
     */
    public InputStream download(String bucket, String fileUri, FTLStoreServiceEnum serviceType) {
        for (FileStoreService fileStoreService : fileStoreServiceList) {
            if (fileStoreService.getClass().equals(serviceType.getType())) {
                return fileStoreService.download(bucket, fileUri);
            }
        }
        return null;
    }

    /**
     * 删除文件
     *
     * @param fileUri     文件的资源定位符
     * @param serviceType 服务类型
     * @return 删除状态
     */
    public Boolean delete(String fileUri, FTLStoreServiceEnum serviceType) {
        for (FileStoreService fileStoreService : fileStoreServiceList) {
            if (fileStoreService.getClass().equals(serviceType.getType())) {
                return fileStoreService.delete(fileUri);
            }
        }
        return false;
    }

    /**
     * 删除文件
     *
     * @param fileUri     文件的资源定位符
     * @param bucket      文件桶名
     * @param serviceType 服务类型
     * @return 删除状态
     */
    public Boolean delete(String bucket, String fileUri, FTLStoreServiceEnum serviceType) {
        for (FileStoreService fileStoreService : fileStoreServiceList) {
            if (fileStoreService.getClass().equals(serviceType.getType())) {
                return fileStoreService.delete(bucket, fileUri);
            }
        }
        return false;
    }


}
