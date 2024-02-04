package cn.fateverse.common.email.service.impl;

import cn.fateverse.common.email.service.session.EmailSessionProvider;
import cn.fateverse.common.email.entity.SendEmailInfo;
import cn.fateverse.common.email.service.EmailService;
import cn.fateverse.common.email.config.EmailProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.Date;

/**
 * 邮件服务默认实现
 *
 * @author Clay
 * @date 2023-03-22
 */
@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private EmailProperties properties;

    @Autowired
    private EmailSessionProvider sessionProvider;


    @Override
    public boolean sendMail(SendEmailInfo email) {
        Session session = sessionProvider.getSession();
        // 创建默认的 MimeMessage 对象
        MimeMessage message = new MimeMessage(session);
        Transport transport = null;
        try {
            message.setSubject(email.getSubject());
            message.setFrom(new InternetAddress(properties.getSender(), properties.getPersonal(), "UTF-8"));

            InternetAddress[] senders = new InternetAddress[email.getSenders().size()];
            for (int i = 0; i < email.getSenders().size(); i++) {
                senders[i] = new InternetAddress(email.getSenders().get(i));
            }
            message.addRecipients(Message.RecipientType.TO, senders);
            if (null != email.getCcPersons() && !email.getCcPersons().isEmpty()) {
                InternetAddress[] ccSenders = new InternetAddress[email.getCcPersons().size()];
                for (int i = 0; i < email.getCcPersons().size(); i++) {
                    ccSenders[i] = new InternetAddress(email.getCcPersons().get(i));
                }
                message.addRecipients(Message.RecipientType.CC, ccSenders);
            }
            message.setContent(email.getContent(), "text/html;charset=UTF-8");
            //new InternetAddress()
            message.setSentDate(new Date());

            message.saveChanges();

            session.setDebug(false);
            transport = session.getTransport();
            transport.connect();

            transport.sendMessage(message, message.getAllRecipients());
            // 7. 关闭连接
        } catch (MessagingException | UnsupportedEncodingException e) {
            e.printStackTrace();
            return false;
        } finally {
            try {
                assert transport != null;
                transport.close();
            } catch (MessagingException e) {
                e.printStackTrace();
            }
        }
        return true;
    }

    @Async
    @Override
    public void asyncSendMail(SendEmailInfo email) {
        sendMail(email);
    }


}
