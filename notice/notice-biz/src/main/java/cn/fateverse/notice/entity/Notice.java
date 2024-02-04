package cn.fateverse.notice.entity;

import cn.fateverse.common.core.annotaion.AutoUser;
import cn.fateverse.common.core.annotaion.EnableAutoField;
import cn.fateverse.common.core.entity.BaseEntity;
import cn.fateverse.common.core.enums.AutoUserEnum;
import cn.fateverse.common.core.enums.MethodEnum;
import cn.fateverse.common.core.enums.StateEnum;
import cn.fateverse.notice.dto.NoticeDto;
import com.alibaba.fastjson2.JSON;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * @author Clay
 * @date 2023-05-04
 */
@Data
@Builder
@EnableAutoField
@AllArgsConstructor
@NoArgsConstructor
public class Notice extends BaseEntity {

    /**
     *
     */
    private Long noticeId;

    private String noticeTitle;

    private String noticeType;

    private String sendType;

    private String senderIds;

    @AutoUser(value = AutoUserEnum.USER_ID,method = MethodEnum.INSERT)
    private Long publishId;

    private String noticeContent;

    private String contentType;

    private String state;

    private String cluster;

    public static Notice toNoticeMq(NoticeDto dto) {
        Notice notice = Notice.builder()
                .noticeTitle(dto.getNoticeTitle())
                .noticeType(dto.getNoticeType())
                .sendType(dto.getSendType())
                .state(StateEnum.NORMAL.getCode())
                .cluster(dto.getCluster())
                .senderIds(JSON.toJSONString(dto.getSenderIds()))
                .noticeContent(dto.getNoticeContent())
                .contentType(dto.getContentType())
                .build();
        notice.setRemark(dto.getRemark());
        return notice;
    }

    public NoticeMq toNoticeMq() {
        return NoticeMq.builder()
                .noticeId(noticeId)
                .noticeType(noticeType)
                .sendType(sendType)
                .senderIds(JSON.parseArray(senderIds,Long.class))
                .cluster(cluster)
                .build();
    }

}
