package cn.fateverse.notice.service.impl;

import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.mybatis.utils.PageUtils;
import cn.fateverse.notice.constant.NoticeConstant;
import cn.fateverse.notice.entity.Notice;
import cn.fateverse.notice.entity.vo.NotifyVo;
import cn.fateverse.notice.mapper.NotifyMapper;
import cn.fateverse.notice.mapper.UserNoticeMapper;
import cn.fateverse.notice.service.NotifyService;
import cn.fateverse.common.security.utils.SecurityUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @author Clay
 * @date 2023-05-07
 */
@Slf4j
@Service
public class NotifyServiceImpl implements NotifyService {

    private final UserNoticeMapper userNoticeMapper;

    private final NotifyMapper notifyMapper;

    public NotifyServiceImpl(NotifyMapper notifyMapper,
                             UserNoticeMapper userNoticeMapper) {
        this.notifyMapper = notifyMapper;
        this.userNoticeMapper = userNoticeMapper;
    }

    @Override
    public TableDataInfo<NotifyVo> searchList(String cluster, String state) {
        PageUtils.startPage();
        List<Notice> list = notifyMapper.selectNoticeList(cluster, state, SecurityUtils.getUserId());
        return PageUtils.convertDataTable(list, NotifyVo::toNotifyVo);
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public NotifyVo searchById(Long noticeId) {
        Notice notice = notifyMapper.selectNoticeByNoticeId(noticeId, SecurityUtils.getUserId());
        if (null == notice) {
            return null;
        }
        if (NoticeConstant.NOT_READ.equals(notice.getState())) {
            userNoticeMapper.read(SecurityUtils.getUserId(), noticeId);
        }
        return NotifyVo.toNotifyVo(notice);
    }

    @Override
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void read(Long noticeId) {
        userNoticeMapper.read(SecurityUtils.getUserId(), noticeId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void readAll() {
        userNoticeMapper.batchRead(SecurityUtils.getUserId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void remove(Long noticeId) {
        userNoticeMapper.delete(SecurityUtils.getUserId(), noticeId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void removeAll() {
        userNoticeMapper.deleteAll(SecurityUtils.getUserId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void batchRemove(List<Long> noticeIds) {
        userNoticeMapper.batchDelete(SecurityUtils.getUserId(), noticeIds);
    }

}
