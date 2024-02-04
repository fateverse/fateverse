package cn.fateverse.common.decrypt.utils;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.util.encoders.Hex;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.Security;

public class SM4Util {

    private static final String ALGORITHM_NAME = "SM4";
    private static final String ALGORITHM_NAME_ECB_PADDING = "SM4/ECB/PKCS7Padding";
    private static final String ALGORITHM_NAME_CBC_PADDING = "SM4/CBC/PKCS7Padding";
    private static final String CHARSET_NAME = "UTF-8";
    private static final String IV_PARAMETER = "0000000000000000";

    static {
        Security.addProvider(new BouncyCastleProvider());
    }

    /**
     * SM4 加密
     *
     * @param plainText 明文
     * @param secretKey 密钥
     * @return 密文
     * @throws Exception 异常
     */
    public static String encrypt(String plainText, String secretKey) throws Exception {
        byte[] keyBytes = secretKey.getBytes(CHARSET_NAME);
        byte[] plainBytes = plainText.getBytes(CHARSET_NAME);
        byte[] cipherBytes = encrypt_ECB_Padding(keyBytes, plainBytes);
        return new String(Hex.encode(cipherBytes));
    }

    /**
     * SM4 解密
     *
     * @param cipherText 密文
     * @param secretKey  密钥
     * @return 明文
     * @throws Exception 异常
     */
    public static String decrypt(String cipherText, String secretKey) throws Exception {
        byte[] keyBytes = secretKey.getBytes(CHARSET_NAME);
        byte[] cipherBytes = Hex.decode(cipherText);
        byte[] plainBytes = decrypt_ECB_Padding(keyBytes, cipherBytes);
        return new String(plainBytes, CHARSET_NAME);
    }

    /**
     * ECB 模式加密
     *
     * @param keyBytes   密钥
     * @param plainBytes 明文
     * @return 密文
     * @throws Exception 异常
     */
    private static byte[] encrypt_ECB_Padding(byte[] keyBytes, byte[] plainBytes) throws Exception {
        Cipher cipher = Cipher.getInstance(ALGORITHM_NAME_ECB_PADDING, BouncyCastleProvider.PROVIDER_NAME);
        SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, ALGORITHM_NAME);
        cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
        return cipher.doFinal(plainBytes);
    }

    /**
     * ECB 模式解密
     *
     * @param keyBytes    密钥
     * @param cipherBytes 密文
     * @return 明文
     * @throws Exception 异常
     */
    private static byte[] decrypt_ECB_Padding(byte[] keyBytes, byte[] cipherBytes) throws Exception {
        Cipher cipher = Cipher.getInstance(ALGORITHM_NAME_ECB_PADDING, BouncyCastleProvider.PROVIDER_NAME);
        SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, ALGORITHM_NAME);
        cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);
        return cipher.doFinal(cipherBytes);
    }

    /**
     * CBC 模式加密
     *
     * @param keyBytes   密钥
     * @param plainBytes 明文
     * @param ivBytes    向量
     * @return 密文
     * @throws Exception 异常
     */
    private static byte[] encrypt_CBC_Padding(byte[] keyBytes, byte[] plainBytes, byte[] ivBytes) throws Exception {
        Cipher cipher = Cipher.getInstance(ALGORITHM_NAME_CBC_PADDING, BouncyCastleProvider.PROVIDER_NAME);
        SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, ALGORITHM_NAME);
        IvParameterSpec ivParameterSpec = new IvParameterSpec(ivBytes);
        cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivParameterSpec);
        return cipher.doFinal(plainBytes);
    }

    /**
     * CBC 模式解密
     *
     * @param keyBytes    密钥
     * @param cipherBytes 密文
     * @param ivBytes     向量
     * @return 明文
     * @throws Exception 异常
     */
    private static byte[] decrypt_CBC_Padding(byte[] keyBytes, byte[] cipherBytes, byte[] ivBytes) throws Exception {
        Cipher cipher = Cipher.getInstance(ALGORITHM_NAME_CBC_PADDING, BouncyCastleProvider.PROVIDER_NAME);
        SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, ALGORITHM_NAME); IvParameterSpec ivParameterSpec = new IvParameterSpec(ivBytes);
        cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, ivParameterSpec); return cipher.doFinal(cipherBytes);
    }
}

