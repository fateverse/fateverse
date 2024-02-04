package cn.fateverse.common.file.enums;

import cn.fateverse.common.file.service.FileStoreService;
import cn.fateverse.common.file.service.impl.AliyunFileStoreService;
import cn.fateverse.common.file.service.impl.FTPFileStoreService;
import cn.fateverse.common.file.service.impl.MinioFileStoreService;

/**
 * @author Clay
 * @date 2023-02-16
 */
public enum FTLStoreServiceEnum {
    /**
     * 阿里云 oss 实现
     */
    ALIYUN_OSS(AliyunFileStoreService.class),
    /**
     * minio 对象存储 实现
     */
    MINIO_FILE(MinioFileStoreService.class),
    /**
     * FTP 文件传输 实现
     */
    FTP_FILE(FTPFileStoreService.class),
    ;

    private final Class<? extends FileStoreService> type;


    FTLStoreServiceEnum(Class<? extends FileStoreService> type) {
        this.type = type;
    }

    public Class<? extends FileStoreService> getType() {
        return type;
    }
}
