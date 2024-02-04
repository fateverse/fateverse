package cn.fateverse.auth.service;

import cn.fateverse.admin.vo.RouterVo;
import cn.fateverse.auth.entity.UserInfo;
import cn.fateverse.auth.entity.LoginBody;

import java.util.List;

/**
 * @author Clay
 * @date 2022/10/27
 */
public interface LoginService {

    /**
     * 登录获取token验证码
     *
     * @param login
     * @return
     */
    String login(LoginBody login);

    /**
     * 登出
     */
    void logout();

    /**
     * 获取用户信息
     * @return
     */
    UserInfo getInfo();

    /**
     * 获取用户的路由信息
     * @return
     */
    List<RouterVo> getMenuRouterByUserId();

}
