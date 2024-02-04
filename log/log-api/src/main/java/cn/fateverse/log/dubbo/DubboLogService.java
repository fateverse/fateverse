package cn.fateverse.log.dubbo;


import cn.fateverse.log.entity.LoginInfo;
import cn.fateverse.log.entity.OperationLog;

import java.util.List;

/**
 * @author Clay
 * @date 2023-02-20
 */
public interface DubboLogService {

    /**
     * 批量保存日志
     *
     * @param list 需要保存的日志
     */
    void batchSaveLog(List<OperationLog> list);

    /**
     * 保存登录信息
     *
     * @param info 登录日志信息
     */
    void saveLoginInfo(LoginInfo info);
}
