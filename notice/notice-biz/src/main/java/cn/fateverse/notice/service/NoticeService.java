package cn.fateverse.notice.service;

import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.notice.dto.NoticeDto;
import cn.fateverse.notice.entity.query.NoticeQuery;
import cn.fateverse.notice.entity.vo.NoticeVo;

import java.util.List;

/**
 * @author Clay
 * @date 2023-05-04
 */
public interface NoticeService {

    /**
     * 查询公告
     *
     * @param noticeId 公告id
     * @return 公告vo对象
     */
    NoticeVo searchById(Long noticeId);

    /**
     * 查询公告数组
     *
     * @param query 查询条件
     * @return 返回对象集合
     */
    TableDataInfo<NoticeVo> searchList(NoticeQuery query);

    /**
     * 导出公告
     *
     * @param query 查询条件
     * @return 返回对象集合
     */
    List<NoticeVo> exportList(NoticeQuery query);

    /**
     * 保存公告
     *
     * @param dto 传输对象
     */
    void save(NoticeDto dto);

    /**
     * 删除公告
     *
     * @param noticeId 公告id
     */
    void removeById(Long noticeId);


}
