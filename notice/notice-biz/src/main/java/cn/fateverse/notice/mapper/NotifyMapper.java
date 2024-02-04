package cn.fateverse.notice.mapper;

import cn.fateverse.notice.entity.Notice;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author Clay
 * @date 2023-05-07
 */
public interface NotifyMapper {
    /**
     * 获取到当前用户的公告列表
     *
     * @param cluster 群组
     * @param state   状态
     * @param userId  用户id
     * @return 消息列表
     */
    List<Notice> selectNoticeList(@Param("cluster") String cluster, @Param("state") String state, @Param("userId") Long userId);

    /**
     * 获取到消息详情
     * @param noticeId
     * @param userId
     * @return
     */
    Notice selectNoticeByNoticeId(@Param("noticeId") Long noticeId,@Param("userId") Long userId);
}
