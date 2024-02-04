package cn.fateverse.notice.mapper;

import cn.fateverse.notice.entity.Notice;
import cn.fateverse.notice.entity.query.NoticeQuery;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author Clay
 * @date 2023-05-04
 */
public interface NoticeMapper {

    /**
     * 查询公告
     *
     * @param noticeId  公告id
     * @param publishId 用户id
     * @return 公告对象
     */
    Notice selectById(@Param("noticeId") Long noticeId, @Param("publishId") Long publishId);

    /**
     * 查询公告 不携带内容
     *
     * @param noticeId  公告id
     * @param publishId 发布人id
     * @return 公告对象
     */
    Notice selectSimpleById(@Param("noticeId") Long noticeId, @Param("publishId") Long publishId);

    /**
     * 查询公告列表
     *
     * @param query 查询对象
     * @return 公告对象数组
     */
    List<Notice> selectList(NoticeQuery query);

    /**
     * 新增公告
     *
     * @param notice 公告对象
     * @return 影响对象
     */
    int insert(Notice notice);

    /**
     * 修改公告
     *
     * @param notice 公告对象
     * @return 影响对象
     */
    int update(Notice notice);

    /**
     * 修改公告状态
     *
     * @param notice 公告对象
     * @return 影响对象
     */
    int changeState(Notice notice);

    /**
     * 删除公告
     *
     * @param id 公告id
     * @return 影响对象
     */
    int deleteById(Long id);

    /**
     * 批量删除
     *
     * @param idList id数组
     * @return 影响对象
     */
    int batchDeleteByIdList(List<Long> idList);

}
