package cn.fateverse.auth.controller;

import cn.hutool.core.codec.Base64;
import cn.fateverse.common.core.constant.CacheConstants;
import cn.fateverse.common.core.constant.Constants;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.utils.uuid.IdUtils;
import com.google.code.kaptcha.Producer;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.util.FastByteArrayOutputStream;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * @author Clay
 * @date 2022/10/30
 */
@Api(tags = "验证码接口")
@Slf4j
@RestController
public class CaptchaController {

    @Resource
    private Producer producer;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;


    /**
     * 生成验证码
     */
    @ApiOperation("生成验证码")
    @GetMapping("/captchaImage")
    public Result<Map<String, Object>> getCode() {
        // 保存验证码信息
        String uuid = IdUtils.simpleUUID();
        String verifyKey = CacheConstants.CAPTCHA_CODE_KEY + uuid;
        String code = producer.createText();
        BufferedImage image = producer.createImage(code);
        redisTemplate.opsForValue().set(verifyKey, code, Constants.CAPTCHA_EXPIRATION, TimeUnit.MINUTES);
        // 将图片转换为base64
        FastByteArrayOutputStream os = new FastByteArrayOutputStream();
        try {
            ImageIO.write(image, "jpg", os);
        } catch (IOException e) {
            return Result.error(e.getMessage());
        }
        Map<String, Object> result = new HashMap<>(0);
        result.put("uuid", uuid);
        result.put("img", Base64.encode(os.toByteArray()));
        return Result.ok(result);
    }
}
