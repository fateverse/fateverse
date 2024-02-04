package cn.fateverse.common.file.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * FTP 配置信息
 *
 * @author Clay
 * @date 2023-03-15
 */
@ConfigurationProperties(prefix = "file.store.ftp")
public class FTPProperties {

    //服务器地址
    private String address;
    //端口号
    private Integer port;
    //用户名
    private String username;
    //密码
    private String password;
    //字符集编码
    private String encoding;
    //资源地址
    private String asset;
    //公开目录
    private String pubfiles;
    //保护目录
    private String prifiles;

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
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

    public String getEncoding() {
        return encoding;
    }

    public void setEncoding(String encoding) {
        this.encoding = encoding;
    }

    public String getAsset() {
        return asset;
    }

    public void setAsset(String asset) {
        this.asset = asset;
    }

    public String getPubfiles() {
        return pubfiles;
    }

    public void setPubfiles(String pubfiles) {
        this.pubfiles = pubfiles;
    }

    public String getPrifiles() {
        return prifiles;
    }

    public void setPrifiles(String prifiles) {
        this.prifiles = prifiles;
    }
}
