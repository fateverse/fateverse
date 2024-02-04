package cn.fateverse.log.service.impl;

import cn.fateverse.common.security.utils.SecurityUtils;
import cn.hutool.core.util.StrUtil;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.mybatis.utils.PageUtils;
import cn.fateverse.log.entity.OperationLog;
import cn.fateverse.log.mapper.OperationMapper;
import cn.fateverse.log.query.OperationLogQuery;
import cn.fateverse.log.service.OperationService;
import cn.fateverse.log.utils.IpLocation;
import cn.fateverse.log.vo.OperationLogVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/1
 */
@Slf4j
@Service
public class OperationServiceImpl implements OperationService {

    private final OperationMapper operationMapper;

    public OperationServiceImpl(OperationMapper operationMapper) {
        this.operationMapper = operationMapper;
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
    public void batchSave(List<OperationLog> operationLogList) {
        if (null == operationLogList || operationLogList.isEmpty()) {
            return;
        }
        operationLogList.forEach(operationLog -> {
            if (!StrUtil.isEmpty(operationLog.getOperIp())) {
                operationLog.setOperLocation(IpLocation.getRegion(operationLog.getOperIp().split(",")[0]));
            }
        });
        operationMapper.batchSave(operationLogList);
    }


    @Override
    public OperationLogVo select(Long operId) {
        OperationLog operationLog = operationMapper.selectById(operId);
        OperationLogVo operationLogVo = OperationLogVo.toOperationLogVo(operationLog);
        if (SecurityUtils.isAdmin()) {
            operationLogVo.setErrorStackTrace(operationLog.getErrorStackTrace());
        }
        return operationLogVo;
    }

    @Override
    public TableDataInfo<OperationLogVo> search(OperationLogQuery operationLogQuery) {
        PageUtils.startPage();
        List<OperationLog> operationLogs = operationMapper.search(operationLogQuery);
        return PageUtils.convertDataTable(operationLogs, OperationLogVo::toOperationLogVo);
    }

    @Override
    public void delete(Long[] operIds) {
        operationMapper.delete(operIds);
    }


}
