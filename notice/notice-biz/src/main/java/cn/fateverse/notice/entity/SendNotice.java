package cn.fateverse.notice.entity;

import cn.fateverse.notice.dto.NoticeDto;
import lombok.Builder;
import lombok.Data;

/**
 * @author Clay
 * @date 2023-05-05
 */
@Data
@Builder
public class SendNotice {

    private String noticeTitle;

    private String noticeType;

    private String noticeContent;

    private String contentType;

    private String remark;

    public static SendNotice toSendNotice(NoticeDto dto) {
        return SendNotice.builder()
                .noticeTitle(dto.getNoticeTitle())
                .noticeType(dto.getNoticeType())
                .noticeContent(dto.getNoticeContent())
                .contentType(dto.getContentType())
                .remark(dto.getRemark())
                .build();
    }
}
