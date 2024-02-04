package cn.fateverse.common.log.utils;

import cn.hutool.core.util.StrUtil;
import cn.fateverse.common.core.utils.HttpServletUtils;
import cn.fateverse.common.core.utils.IpUtils;
import cn.fateverse.common.log.enums.LoginStatus;
import cn.fateverse.log.entity.LoginInfo;
import eu.bitwalker.useragentutils.UserAgent;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;

/**
 * @author Clay
 * @date 2022/11/2
 */
public class LoginInfoUtil {

    /**
     * 成功是的登录信息实体
     * @param userName
     * @return
     */
    public static LoginInfo successLogin(String userName){
        LoginInfo loginInfo = new LoginInfo();
        loginInfo.setUserName(userName);
        loginInfo.setState(LoginStatus.SUCCESS.getCode());
        loginInfo.setMsg(LoginStatus.SUCCESS.getInfo());
        setSystemInfo(loginInfo);
        return loginInfo;
    }

    /**
     * 失败时的登录信息实体
     *
     * @param userName
     * @param msg
     * @return
     */
    public static LoginInfo successFail(String userName,String msg){
        LoginInfo loginInfo = new LoginInfo();
        loginInfo.setUserName(userName);
        loginInfo.setState(LoginStatus.FAIL.getCode());
        if (!StrUtil.isEmpty(msg)){
            loginInfo.setMsg(msg);
        }else {
            loginInfo.setMsg(LoginStatus.FAIL.getInfo());
        }
        setSystemInfo(loginInfo);
        return loginInfo;
    }


    /**
     * 设置系统相关信息
     * @param loginInfo
     */
    private static void setSystemInfo(LoginInfo loginInfo){
        HttpServletRequest request = HttpServletUtils.getRequest();
        String ipAdder = IpUtils.getIpAdder(request);
        loginInfo.setIpddr(ipAdder);
        final UserAgent userAgent = UserAgent.parseUserAgentString(request.getHeader("User-Agent"));
        //获取操作系统信息
        String osName = userAgent.getOperatingSystem().getName();
        loginInfo.setOs(osName);
        //获取浏览器信息
        String browser = userAgent.getBrowser().getName();
        loginInfo.setBrowser(browser);
        loginInfo.setLoginTime(new Date());
    }


}
