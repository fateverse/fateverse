package cn.fateverse.log.service;

import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.log.entity.LoginInfo;
import cn.fateverse.log.query.LoginLogQuery;
import cn.fateverse.log.vo.LoginInfoVo;

/**
 * @author Clay
 * @date 2022/11/2
 */
public interface LoginInfoService {
    /**
     * 保存登录日志信息
     *
     * @param info
     * @return
     */
    int save(LoginInfo info);

    /**
     * 登录日志查询
     *
     * @param loginLogQuery 日志查询条件
     * @return 表格数据
     */
    TableDataInfo<LoginInfoVo> search(LoginLogQuery loginLogQuery);

    /**
     * 删除登录日志
     *
     * @param infoIds 日志id
     */
    void delete(Long[] infoIds);

    /**
     * 查询登录日志详情
     *
     * @param infoId 日志id
     * @return 日志详情
     */
    LoginInfoVo select(Long infoId);
}
