package cn.fateverse.admin.service;

import cn.fateverse.admin.entity.OnlineUser;
import cn.fateverse.common.core.result.page.TableDataInfo;


/**
 * @author Clay
 * @date 2022/11/12
 */
public interface OnlineUserService {

    /**
     * 查询在线用户列表
     *
     * @param place
     * @param username
     * @return
     */
    TableDataInfo<OnlineUser> searchList(String place, String username);

    /**
     * 强制退出用户
     *
     * @param tokenId
     */
    void force(String tokenId);


}
