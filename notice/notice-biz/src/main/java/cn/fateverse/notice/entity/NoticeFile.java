package cn.fateverse.notice.entity;

import lombok.Builder;
import lombok.Data;

/**
 * @author Clay
 * @date 2023-08-01
 */
@Data
@Builder
public class NoticeFile {
    //附件路径
    private String url;
    //是否是图片
    private Boolean isImage;
    //附件大小
    private Long size;
}
