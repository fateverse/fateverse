package cn.fateverse.notice.service;

import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.notice.entity.vo.NotifyVo;

import java.util.List;

/**
 * @author Clay
 * @date 2023-05-07
 */
public interface NotifyService {
    /**
     * 查询用户个人的通告
     *
     * @param cluster 消息所在的群组
     * @param state   消息状态
     * @return 消息信息
     */
    TableDataInfo<NotifyVo> searchList(String cluster, String state);

    /**
     * 根据id查询当前通告
     *
     * @param noticeId 通告id
     * @return 消息信息
     */
    NotifyVo searchById(Long noticeId);

    /**
     * 阅读消息
     *
     * @param noticeId 消息di
     */
    void read(Long noticeId);

    /**
     * 一键阅读全部消息
     */
    void readAll();

    /**
     * 删除消息
     *
     * @param noticeId 消息id
     */
    void remove(Long noticeId);

    /**
     * 删除所有的消息
     */
    void removeAll();

    /**
     * 批量删除通知消息
     *
     * @param noticeIds 需要批量删除的消息
     */
    void batchRemove(List<Long> noticeIds);
}
