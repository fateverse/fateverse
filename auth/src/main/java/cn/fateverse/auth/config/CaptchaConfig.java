package cn.fateverse.auth.config;

import com.google.code.kaptcha.impl.DefaultKaptcha;
import com.google.code.kaptcha.util.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Properties;

import static com.google.code.kaptcha.Constants.*;

/**
 * 验证码配置
 *
 * @author Clay
 */
@Configuration
public class CaptchaConfig {
    @Bean
    public DefaultKaptcha kaptchaProducer() {
        Properties properties = new Properties();
        properties.setProperty(KAPTCHA_BORDER,"no");
        properties.setProperty(KAPTCHA_IMAGE_WIDTH,"200");
        properties.setProperty(KAPTCHA_IMAGE_HEIGHT,"60");
        properties.setProperty(KAPTCHA_TEXTPRODUCER_FONT_SIZE,"40");
//        properties.setProperty(KAPTCHA_TEXTPRODUCER_FONT_COLOR,"0,0,0"); //字体颜色（RGB）
        properties.setProperty(KAPTCHA_TEXTPRODUCER_CHAR_LENGTH, "4");
        properties.setProperty(KAPTCHA_BACKGROUND_CLR_FROM,"253,220,114");
        properties.setProperty(KAPTCHA_BACKGROUND_CLR_TO,"65,88,208");
        properties.setProperty(KAPTCHA_BACKGROUND_IMPL,"com.google.code.kaptcha.impl.DefaultBackground");
        properties.setProperty(KAPTCHA_OBSCURIFICATOR_IMPL, "com.google.code.kaptcha.impl.ShadowGimpy");
        // 图片样式
        //水纹 com.google.code.kaptcha.impl.WaterRipple
        //鱼眼 com.google.code.kaptcha.impl.FishEyeGimpy
        //阴影 com.google.code.kaptcha.impl.ShadowGimpy
//        properties.setProperty(KAPTCHA_TEXTPRODUCER_CHAR_STRING,"123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$!@&%");
        properties.setProperty(KAPTCHA_TEXTPRODUCER_CHAR_STRING,"1234567890");
        properties.setProperty(KAPTCHA_OBSCURIFICATOR_IMPL, "com.google.code.kaptcha.impl.ShadowGimpy");
        DefaultKaptcha defaultKaptcha = new DefaultKaptcha();
        Config config = new Config(properties);
        defaultKaptcha.setConfig(config);
        return defaultKaptcha;
    }
}
