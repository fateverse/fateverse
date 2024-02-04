package cn.fateverse.code.util.velocity;

import cn.fateverse.common.core.constant.Constants;
import org.apache.velocity.app.Velocity;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;

import java.util.Properties;

/**
 * Velocity初始化
 *
 * @author Clay
 * @date 2022/11/18
 */
public class VelocityInitializer {
    /**
     * 初始化Velocity
     */
    public static void initVelocity(){
        Properties properties = new Properties();
        properties.setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath");
        properties.setProperty("classpath.resource.loader.class", ClasspathResourceLoader.class.getName());
        properties.setProperty(Velocity.ENCODING_DEFAULT, Constants.UTF8);
        properties.setProperty(Velocity.OUTPUT_ENCODING, Constants.UTF8);
        Velocity.init(properties);
    }
}
