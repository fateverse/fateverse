package cn.fateverse.notice.dubbo;

import cn.fateverse.notice.dto.NoticeDto;
import org.springframework.scheduling.annotation.Async;

/**
 * @author Clay
 * @date 2023-05-04
 */
public interface DubboNoticeService {

    /**
     * 异步发送消息
     * @param noticeDto 发送消息实体
     */
    @Async
    void syncSend(NoticeDto noticeDto);

    /**
     * 发送消息
     * @param noticeDto 发送消息实体
     */
    void send(NoticeDto noticeDto);

}
