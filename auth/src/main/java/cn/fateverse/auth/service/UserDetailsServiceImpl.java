package cn.fateverse.auth.service;

import cn.fateverse.admin.dubbo.DubboUserService;
import cn.fateverse.common.core.enums.UserState;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.utils.ObjectUtils;
import cn.fateverse.common.security.entity.LoginUser;
import cn.fateverse.admin.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.apache.dubbo.config.annotation.DubboReference;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

/**
 * @author Clay
 * @date 2022/10/27
 */
@Slf4j
@Component
public class UserDetailsServiceImpl implements UserDetailsService {

    @DubboReference
    private DubboUserService userService;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //todo 编辑用户登录相关逻辑
        log.info("有用户登录:{}",username);
        User user = userService.getUserByUsername(username);
        if (ObjectUtils.isEmpty(user)) {
            log.info("登录用户：{} 不存在.", username);
            throw new UsernameNotFoundException("登录用户：" + username + " 不存在");
        } else if (UserState.DELETED.getCode().equals(user.getDelFlag())) {
            log.info("登录用户：{} 已被删除.", username);
            throw new CustomException("对不起，您的账号：" + username + " 已被删除");
        } else if (UserState.DISABLE.getCode().equals(user.getState())) {
            log.info("登录用户：{} 已被停用.", username);
            throw new CustomException("对不起，您的账号：" + username + " 已停用");
        }
        return new LoginUser(user);
    }
}
