package cn.fateverse.notice.entity;

import cn.fateverse.notice.enums.ActionEnums;
import io.netty.channel.ChannelId;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * @author Clay
 * @date 2023-05-24
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NoticeMq implements Serializable {

    private Long noticeId;

    private String noticeTitle;

    private String noticeType;

    private String sendType;

    private ActionEnums action;

    private List<Long> senderIds;

    private String noticeContent;

    private String contentType;

    private String cluster;

    private String remark;

    private ChannelId channelId;

}
