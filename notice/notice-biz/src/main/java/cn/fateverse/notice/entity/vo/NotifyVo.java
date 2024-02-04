package cn.fateverse.notice.entity.vo;

import cn.fateverse.notice.constant.NoticeConstant;
import cn.fateverse.notice.entity.Notice;
import cn.fateverse.notice.entity.NoticeMq;
import cn.fateverse.notice.enums.ActionEnums;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Clay
 * @date 2023-05-07
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotifyVo {

    private Long noticeId;

    @ApiModelProperty("公告标题")
    private String noticeTitle;

    @ApiModelProperty("公告类型（1通知 2公告）")
    private String noticeType;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String noticeContent;

    @ApiModelProperty("消息阅读状态")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String state;

    @JsonIgnore
    private ActionEnums action;

    @ApiModelProperty("群组")
    private String cluster;

    public static NotifyVo toNotifyVo(Notice notice) {
        return NotifyVo.builder()
                .noticeId(notice.getNoticeId())
                .noticeTitle(notice.getNoticeTitle())
                .noticeContent(notice.getNoticeContent())
                .state(notice.getState())
                .cluster(notice.getCluster())
                .build();
    }

    public static NotifyVo toNotifyVo(NoticeMq notice) {
        NotifyVo vo = NotifyVo.builder()
                .noticeId(notice.getNoticeId())
                .noticeTitle(notice.getNoticeTitle())
                .noticeType(notice.getNoticeType())
                .noticeContent(notice.getNoticeContent())
                .action(notice.getAction())
                .cluster(notice.getCluster())
                .build();
        if (notice.getAction().equals(ActionEnums.SEND)){
            vo.setState(NoticeConstant.NOT_READ);
        }
        return vo;

    }

}
