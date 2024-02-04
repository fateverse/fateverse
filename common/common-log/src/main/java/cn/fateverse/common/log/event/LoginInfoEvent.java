package cn.fateverse.common.log.event;

import cn.fateverse.log.entity.LoginInfo;
import org.springframework.context.ApplicationEvent;

/**
 * 登录操作的日志收集,采用时间发布机制触发日志保存的操作
 *
 * @author Clay
 * @date 2022/11/2
 */
public class LoginInfoEvent extends ApplicationEvent {


    public LoginInfoEvent(LoginInfo source) {
        super(source);
    }
}
