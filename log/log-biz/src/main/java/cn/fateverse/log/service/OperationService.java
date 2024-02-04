package cn.fateverse.log.service;

import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.log.entity.OperationLog;
import cn.fateverse.log.query.OperationLogQuery;
import cn.fateverse.log.vo.OperationLogVo;

import java.util.List;

/**
 * 操作日志service服务
 *
 * @author Clay
 * @date 2022/11/1
 */
public interface OperationService {

    /**
     * 批量保存日志信息
     *
     * @param operationLogList 需要保存的日志信息
     */
    void batchSave(List<OperationLog> operationLogList);

    /**
     * 获取操作日志详情
     *
     * @param operId 操作日志id
     * @return 操作日志返回对象
     */
    OperationLogVo select(Long operId);

    /**
     * 获取操作日志
     *
     * @param operationLogQuery 操作日志查询
     * @return 操作日志列表
     */
    TableDataInfo<OperationLogVo> search(OperationLogQuery operationLogQuery);

    /**
     * 删除日志
     *
     * @param operIds 操作日志id
     */
    void delete(Long[] operIds);

}
