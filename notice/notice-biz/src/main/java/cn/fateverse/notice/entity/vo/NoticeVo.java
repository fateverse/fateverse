package cn.fateverse.notice.entity.vo;

import cn.fateverse.notice.entity.Notice;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * @author Clay
 * @date 2023-05-05
 */
@Data
@Builder
public class NoticeVo {

    private Long noticeId;

    @ApiModelProperty("公告标题")
    private String noticeTitle;

    @ApiModelProperty("公告类型（1通知 2公告）")
    private String noticeType;

    @ApiModelProperty("发送类型,用户,用户数组,角色,部门,全发")
    private String sendType;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @ApiModelProperty("发送类型对应的信息")
    private List<String> senders;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String noticeContent;

    @ApiModelProperty("内容类型: html,text等")
    private String contentType;

    @ApiModelProperty("公告状态（0正常 1关闭）")
    private String state;

    @ApiModelProperty("群组")
    private String cluster;

    @ApiModelProperty("创建人")
    private Object createBy;

    @ApiModelProperty("创建时间")
    private Date createTime;

    public static NoticeVo toNoticeVo(Notice notice){
        return NoticeVo.builder()
                .noticeId(notice.getNoticeId())
                .noticeTitle(notice.getNoticeTitle())
                .noticeType(notice.getNoticeType())
                .sendType(notice.getSendType())
                .noticeContent(notice.getNoticeContent())
                .contentType(notice.getContentType())
                .state(notice.getState())
                .cluster(notice.getCluster())
                .createBy(notice.getCreateBy())
                .createTime(notice.getCreateTime())
                .build();
    }
}
