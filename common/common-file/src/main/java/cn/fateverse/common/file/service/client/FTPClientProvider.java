package cn.fateverse.common.file.service.client;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPClientConfig;
import org.apache.commons.net.ftp.FTPReply;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * ftp 客户端 provider
 *
 * @author Clay
 * @date 2023-03-15
 */
public class FTPClientProvider {

    private static final Logger logger = LoggerFactory.getLogger(FTPClientProvider.class);

    /**
     * 获取到ftp客户端
     *
     * @param address  地址
     * @param port     端口
     * @param username 用户名
     * @param password 密码
     * @param encoding 字符集编码
     * @return ftp客户端
     */
    public FTPClient getClient(String address, Integer port, String username, String password, String encoding) {
        //实例FTP客户端
        FTPClient ftpClient = new FTPClient();
        ftpClient.setAutodetectUTF8(true);
        try {
            ftpClient.connect(address, port);
            ftpClient.enterLocalPassiveMode();
            // 保存FTP控制连接使用的字符集，必须在连接前设置
            ftpClient.login(username, password, encoding);
            ftpClient.setFileType(FTPClient.BINARY_FILE_TYPE);
            //设置linux ftp服务器
            FTPClientConfig conf = new FTPClientConfig(FTPClientConfig.SYST_UNIX);
            ftpClient.configure(conf);
            if (!FTPReply.isPositiveCompletion(ftpClient.getReplyCode())) {
                logger.error("未连接到FTP，用户名或密码错误。");
                ftpClient.disconnect();
                throw new RuntimeException("未连接到FTP，用户名或密码错误。");
            } else {
                logger.info("FTP连接成功");
                return ftpClient;
            }
        } catch (Exception e) {
            throw new RuntimeException("FTP登录失败");
        }

    }


}
