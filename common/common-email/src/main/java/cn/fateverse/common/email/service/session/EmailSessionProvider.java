package cn.fateverse.common.email.service.session;

import cn.fateverse.common.email.config.EmailProperties;
import org.springframework.beans.factory.annotation.Autowired;

import javax.mail.Authenticator;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import java.util.Properties;

/**
 * 邮件发送Session获取
 *
 * @author Clay
 * @date 2023-03-22
 */
public class EmailSessionProvider {


    @Autowired
    private EmailProperties properties;

    private volatile Session session;

    public Session getSession() {
        if (session == null) {
            synchronized (this) {
                if (session == null) {
                    // 参数配置
                    Properties props = new Properties();
                    // 使用的协议（JavaMail规范要求）
                    props.setProperty("mail.transport.protocol", "smtp");
                    // 发件人的邮箱的 SMTP 服务器地址
                    props.setProperty("mail.smtp.host", properties.getEmailSmtpHost());
                    //发件人的邮箱的 SMTP 服务器端口
                    props.setProperty("mail.smtp.port", properties.getEmailSmtpPort());
                    // 需要请求认证
                    props.setProperty("mail.smtp.auth", "true");
                    props.setProperty("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
                    props.setProperty("mail.smtp.socketFactory.fallback", "false");
                    props.setProperty("mail.smtp.socketFactory.port", properties.getEmailSmtpPort());
                    session = Session.getDefaultInstance(props, new Authenticator() {
                        @Override
                        protected PasswordAuthentication getPasswordAuthentication() {
                            return new PasswordAuthentication(properties.getUsername(), properties.getPassword());
                        }
                    });
                }
            }
        }
        return session;
    }
}
