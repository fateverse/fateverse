package cn.fateverse.common.email.service;

import cn.fateverse.common.email.entity.SendEmailInfo;

/**
 * @author Clay
 * @date 2023-03-22
 */
public interface EmailService {

    /**
     * 同步发送邮件
     *
     * @param email 邮件信息
     * @return 发送结果
     */
    boolean sendMail(SendEmailInfo email);

    /**
     * 异步发送邮件
     *
     * @param email 邮件信息
     */
    void asyncSendMail(SendEmailInfo email);
}
