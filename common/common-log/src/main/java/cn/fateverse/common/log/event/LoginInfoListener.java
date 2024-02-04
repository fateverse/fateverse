package cn.fateverse.common.log.event;

import cn.fateverse.log.dubbo.DubboLogService;
import cn.fateverse.log.entity.LoginInfo;
import lombok.extern.slf4j.Slf4j;
import org.apache.dubbo.config.annotation.DubboReference;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;


/**
 * @author Clay
 * @date 2022/11/2
 */
@Slf4j
public class LoginInfoListener {

    @DubboReference
    private DubboLogService logService;

    private final ThreadPoolTaskExecutor executor;

    public LoginInfoListener(ThreadPoolTaskExecutor executor) {
        this.executor = executor;
    }

    /**
     * LoginInfoListener监听器,监听LoginInfoEvent所发布的时间,调用rpc实现远程日志记录
     * @param event
     */
    @EventListener(LoginInfoEvent.class)
    public void saveLoginInfo(LoginInfoEvent event){
        executor.execute(()->{
            LoginInfo loginInfo = (LoginInfo) event.getSource();
            log.info(loginInfo.toString());
            logService.saveLoginInfo(loginInfo);
        });
    }

}
