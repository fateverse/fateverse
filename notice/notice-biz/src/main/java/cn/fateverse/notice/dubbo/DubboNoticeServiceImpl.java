package cn.fateverse.notice.dubbo;

import cn.fateverse.notice.service.NoticeService;
import cn.fateverse.notice.dto.NoticeDto;
import org.apache.dubbo.config.annotation.DubboService;
import org.springframework.scheduling.annotation.Async;

/**
 * @author Clay
 * @date 2023-05-04
 */
@DubboService
public class DubboNoticeServiceImpl implements DubboNoticeService{

    private final NoticeService noticeService;

    public DubboNoticeServiceImpl(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @Async
    @Override
    public void syncSend(NoticeDto noticeDto) {
        noticeService.save(noticeDto);
    }

    @Override
    public void send(NoticeDto noticeDto) {
        noticeService.save(noticeDto);
    }
}
