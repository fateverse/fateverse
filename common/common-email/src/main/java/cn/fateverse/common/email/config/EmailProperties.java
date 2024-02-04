package cn.fateverse.common.email.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 系统邮件发送服务器
 *
 * @author Clay
 * @date 2023-03-22
 */
@ConfigurationProperties(prefix = "email")
public class EmailProperties {
    /**
     * 邮件服务器发送者邮箱
     */
    private String sender;
    /**
     * 发送人名称
     */
    private String personal;
    /**
     * 邮件服务器
     */
    private String emailSmtpHost;
    /**
     * 邮件服务器端口
     */
    private String emailSmtpPort;
    /**
     * 邮件发送者用户名
     */
    private String username;
    /**
     * 发送者密码
     */
    private String password;
    /**
     * 邮件服务器协议
     */
    private String encryption;


    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getPersonal() {
        return personal;
    }

    public void setPersonal(String personal) {
        this.personal = personal;
    }

    public String getEmailSmtpHost() {
        return emailSmtpHost;
    }

    public void setEmailSmtpHost(String emailSmtpHost) {
        this.emailSmtpHost = emailSmtpHost;
    }

    public String getEmailSmtpPort() {
        return emailSmtpPort;
    }

    public void setEmailSmtpPort(String emailSmtpPort) {
        this.emailSmtpPort = emailSmtpPort;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEncryption() {
        return encryption;
    }

    public void setEncryption(String encryption) {
        this.encryption = encryption;
    }
}
