package cn.fateverse.common.core.utils;

import cn.fateverse.common.core.exception.CustomException;

import java.net.Inet4Address;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * @author Clay
 * @date 2023-10-15
 */
public class IpBackUtils {

    public static final String BLACK_LIST = "black:list:";
    public final static String BLACK_LIST_IPV_4 = BLACK_LIST + "ipv4";
    public final static String BLACK_LIST_IPV_6 = BLACK_LIST + "ipv6";
    public final static String BLACK_LIST_IP = BLACK_LIST + "ip";
    public final static String IPV_4 = "ipv4";
    public final static String IPV_6 = "ipv6";


    public static long ipToDecimal(String ipAddress) {
        try {
            // 将IP地址拆分为四个部分
            String[] ipParts = ipAddress.split("\\.");
            // 将每个部分转换为整数
            long decimalNumber = 0;
            for (int i = 0; i < 4; i++) {
                long ipPart = Long.parseLong(ipParts[i]);
                // 每个部分的权重为256的(3-i)次方
                decimalNumber += ipPart * Math.pow(256, 3 - i);
            }
            return decimalNumber;
        } catch (Exception e) {
            return 0;
        }
    }


    public static String getIpType(String ip) {
        try {
            InetAddress address = InetAddress.getByName(ip);
            if (address instanceof Inet4Address) {
                return IPV_4;
            } else if (address instanceof Inet6Address) {
                return IPV_6;
            }
        } catch (UnknownHostException e) {
            throw new CustomException("无效ip地址");
        }
        throw new CustomException("无效ip地址");
    }

}
