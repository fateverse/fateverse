package cn.fateverse.code.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/17
 */
@Component
@ConfigurationProperties(prefix = "gen")
public class CodeGenConfig {
    /**
     * 作者
     */
    private static String author;

    /**
     * 包名
     */
    private static String packageName;

    /**
     * 是否去掉前缀
     */
    private static boolean autoRemovePre;

    /**
     * 需要去除的前缀列表
     */
    private static List<String> tablePrefix;


    public static String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        CodeGenConfig.author = author;
    }

    public static String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        CodeGenConfig.packageName = packageName;
    }

    public static boolean isAutoRemovePre() {
        return autoRemovePre;
    }

    public void setAutoRemovePre(boolean autoRemovePre) {
        CodeGenConfig.autoRemovePre = autoRemovePre;
    }

    public static List<String> getTablePrefix() {
        return tablePrefix;
    }

    public void setTablePrefix(List<String> tablePrefix) {
        CodeGenConfig.tablePrefix = tablePrefix;
    }
}
