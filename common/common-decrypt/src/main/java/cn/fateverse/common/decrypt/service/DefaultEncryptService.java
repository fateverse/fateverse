package cn.fateverse.common.decrypt.service;

import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.decrypt.config.EncryptProperties;
import cn.fateverse.common.decrypt.utils.SM4Util;

import javax.annotation.Resource;

/**
 * @author Clay
 * @date 2023-08-07
 */

public class DefaultEncryptService implements EncryptService {

    private final EncryptProperties properties;

    public DefaultEncryptService(EncryptProperties properties) {
        this.properties = properties;
    }

    @Override
    public String encrypt(String plainText) {
        try {
            return SM4Util.encrypt(plainText, properties.getSecretKey());
        } catch (Exception e) {
            throw new CustomException("加密失败", e);
        }
    }

    @Override
    public String decrypt(String cipherText) {
        try {
            return SM4Util.decrypt(cipherText, properties.getSecretKey());
        } catch (Exception e) {
            throw new CustomException("解密失败", e);
        }
    }


}
