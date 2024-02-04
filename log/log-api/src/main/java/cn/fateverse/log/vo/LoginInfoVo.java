package cn.fateverse.log.vo;

import cn.fateverse.log.entity.LoginInfo;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.BeanUtils;

import java.io.Serializable;
import java.util.Date;

/**
 * 用户登录信息
 *
 * @author Clay
 * @date 2022/11/2
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginInfoVo implements Serializable {

    /**
     * 访问Id
     */
    @JsonSerialize(using = ToStringSerializer.class)
    private Long infoId;
    /**
     * 用户名
     */
    private String userName;
    /**
     * 登录ip
     */
    private String ipddr;
    /**
     * 登录地点
     */
    private String loginLocation;
    /**
     * 浏览器类型
     */
    private String browser;
    /**
     * 操作系统
     */
    private String os;
    /**
     * 登录状态
     */
    private Integer state;
    /**
     * 登录信息
     */
    private String msg;
    /**
     * 登录时间
     */
    private Date loginTime;


    public static LoginInfoVo toLoginInfoVo(LoginInfo info) {
        LoginInfoVo vo = new LoginInfoVo();
        BeanUtils.copyProperties(info, vo);
        return vo;
    }

}
