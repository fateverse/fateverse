package cn.fateverse.common.email.entity;

import java.util.List;

/**
 * 邮件发送对象
 *
 * @author Clay
 * @date 2023-03-22
 */
public class SendEmailInfo {

    /**
     * 邮件主题
     */
    private String subject;
    /**
     * 发送对象
     */
    private List<String> senders;
    /**
     * 抄送对象
     */
    private List<String> ccPersons;
    /**
     * 邮件内容
     */
    private String content;
    /**
     * 主题
     */
    private String ThemeEnums;


    public SendEmailInfo() {
    }


    public SendEmailInfo(String subject, List<String> senders, List<String> ccPersons, String content) {
        this.subject = subject;
        this.senders = senders;
        this.ccPersons = ccPersons;
        this.content = content;
    }

    public SendEmailInfo(String subject, List<String> senders, List<String> ccPersons, String content, String themeEnums) {
        this.subject = subject;
        this.senders = senders;
        this.ccPersons = ccPersons;
        this.content = content;
        ThemeEnums = themeEnums;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public List<String> getSenders() {
        return senders;
    }

    public void setSenders(List<String> senders) {
        this.senders = senders;
    }

    public List<String> getCcPersons() {
        return ccPersons;
    }

    public void setCcPersons(List<String> ccPersons) {
        this.ccPersons = ccPersons;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getThemeEnums() {
        return ThemeEnums;
    }

    public void setThemeEnums(String themeEnums) {
        ThemeEnums = themeEnums;
    }
}
