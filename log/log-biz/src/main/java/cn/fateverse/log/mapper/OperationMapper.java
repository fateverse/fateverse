package cn.fateverse.log.mapper;


import cn.fateverse.common.core.entity.PageInfo;
import cn.fateverse.log.entity.OperationLog;
import cn.fateverse.log.query.OperationLogQuery;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/1
 */
public interface OperationMapper {

    /**
     * 批量保存日志信息
     *
     * @param operationLogList 日志保存信息
     */
    int batchSave(List<OperationLog> operationLogList);

    /**
     * 获取操作日志详情
     *
     * @param operId 操作日志id
     * @return 操作日志返回对象
     */
    OperationLog selectById(@Param("operId") Long operId);

    /**
     * 查询操作日志
     *
     * @param operationLogQuery
     * @return
     */
    List<OperationLog> search(@Param("operation") OperationLogQuery operationLogQuery);

    List<OperationLog> searchSubQuery(@Param("operation") OperationLogQuery operationLogQuery, @Param("start") Integer start, @Param("size") Integer size);

    Long searchCount(@Param("operation") OperationLogQuery operationLogQuery, @Param("start") Integer start, @Param("size") Integer size);

    /**
     * 删除日志
     *
     * @param operIds 操作日志id
     */
    int delete(Long[] operIds);

}
