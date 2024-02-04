package cn.fateverse.log.utils;

import org.apache.commons.io.IOUtils;
import org.lionsoul.ip2region.xdb.Searcher;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * @author Clay
 * @date 2023-06-02
 */
public class IpLocation {


    private static volatile Searcher searcher = null;


    private static Searcher getDbSearcher() {
        if (null == searcher) {
            synchronized (IpLocation.class) {
                if (null == searcher) {
                    InputStream inputStream = IpLocation.class.getResourceAsStream("/ip2region.xdb");
                    try {
                        searcher = Searcher.newWithBuffer(IOUtils.toByteArray(inputStream));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
            }
        }
        return searcher;
    }

    public static String getRegion(String ip) {
        String region;
        try {
            Searcher searcher = getDbSearcher();
            if (null == searcher) {
                return "";
            }
            region = searcher.search(ip);
            region = region.replaceAll("0\\|", "");
            region = Arrays.stream(region.split("\\|")).distinct().collect(Collectors.joining(" "));
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
        return region;
    }


}
