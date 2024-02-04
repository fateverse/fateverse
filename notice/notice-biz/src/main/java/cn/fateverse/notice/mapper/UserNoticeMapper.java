package cn.fateverse.notice.mapper;

import cn.fateverse.notice.entity.UserNotice;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author Clay
 * @date 2023-05-04
 */
public interface UserNoticeMapper {
    /**
     * 添加用户与公告之间的映射关系
     *
     * @param userNotice 映射对象
     * @return 影响数量
     */
    int insert(UserNotice userNotice);

    /**
     * 批量添加用户公告之间的映射关系
     *
     * @param list 映射关系
     * @return 影响数量
     */
    int batchInsert(List<UserNotice> list);

    /**
     * 用户全部阅读公告
     *
     * @param userId 用户id
     * @return 影响结果
     */
    int batchRead(Long userId);

    /**
     * 阅读消息
     *
     * @param userId   用户id
     * @param noticeId 公告id
     * @return 影响结果
     */
    int read(@Param("userId") Long userId, @Param("noticeId") Long noticeId);

    /**
     * 用户删除公告
     *
     * @param userId   用户id
     * @param noticeId 公告id
     * @return 影响结果
     */
    int delete(@Param("userId") Long userId, @Param("noticeId") Long noticeId);

    /**
     * 用户批量删除公告
     *
     * @param userId       用户id
     * @param noticeIdList 公告列表
     * @return 影响结果
     */
    int batchDelete(@Param("userId") Long userId, @Param("noticeIdList") List<Long> noticeIdList);

    /**
     * 删除全部消息
     * @param userId 用户id
     * @return 删除结果
     */
    int deleteAll(@Param("userId") Long userId);

    /**
     * 根据消息id删除消息公告
     *
     * @param noticeId 公告id
     * @return 影响结果
     */
    int deleteByNoticeId(Long noticeId);
}
