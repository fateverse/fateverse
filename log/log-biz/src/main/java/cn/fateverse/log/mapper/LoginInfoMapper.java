package cn.fateverse.log.mapper;


import cn.fateverse.log.entity.LoginInfo;
import cn.fateverse.log.query.LoginLogQuery;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/2
 */
public interface LoginInfoMapper {

    /**
     * 保存登录日志信息
     *
     * @param loginInfo
     * @return
     */
    int save(LoginInfo loginInfo);

    /**
     * 查询登录日志
     *
     * @param loginLogQuery
     * @return
     */
    List<LoginInfo> search(LoginLogQuery loginLogQuery);
    /**
     * 删除登录日志
     *
     * @param infoIds 日志id
     */
    int delete(Long[] infoIds);

    /**
     * 查询登录日志详情
     *
     * @param infoId 日志id
     * @return 日志详情
     */
    LoginInfo selectById(@Param("infoId") Long infoId);

}
