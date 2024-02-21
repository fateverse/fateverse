package cn.fateverse.common.decrypt.service;

/**
 * @author Clay
 * @date 2024/2/19 16:19
 */
public interface EncryptService {

    /**
     * 加密方法
     *
     * @param plainText 需要加密的文档
     * @return 加密之后的数据
     */
    String encrypt(String plainText);

    /**
     * 解密方法
     *
     * @param cipherText 需要解密的文档
     * @return 解密之后的文档
     */
    String decrypt(String cipherText);
}
