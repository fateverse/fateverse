package cn.fateverse.common.file.entity;

import lombok.Builder;
import lombok.Data;

/**
 * @author Clay
 * @date 2023/1/10
 */
@Data
@Builder
public class FileInfo {
    /**
     * 文件名称
     */
    private String fileName;
    /**
     * 缩略图名称
     */
    private String thumbnailFileName;
    /**
     * 文件原始名称
     */
    private String originalFilename;
    /**
     * 文件url
     */
    private String url;
    /**
     * 资源路径
     */
    private String uri;
    /**
     * 缩略图uri
     */
    private String thumbnailUri;
    /**
     * 路径
     */
    private String path;
    /**
     * 文件类型
     */
    private String fileType;
    /**
     * 文件大小
     */
    private Long size;
    /**
     * 是否是图片
     */
    private Boolean isImage;


    private String contentType;

}
