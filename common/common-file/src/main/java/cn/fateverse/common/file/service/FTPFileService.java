package cn.fateverse.common.file.service;

import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.file.config.FTPProperties;
import cn.fateverse.common.file.entity.FileInfo;
import cn.fateverse.common.file.utils.FileStoreServiceUtil;
import cn.fateverse.common.file.service.client.FTPClientProvider;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.net.ftp.FTPClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * ftp 文件存储服务
 *
 * @author Clay
 * @date 2023-03-15
 */
@Slf4j
public class FTPFileService {

    @Autowired
    private FTPProperties properties;

    @Autowired
    private FTPClientProvider clientProvider;


    private String address;
    private String asset;
    private String pubfiles;
    private String prifiles;


    public String getAsset() {
        return asset;
    }

    /**
     * 初始化字段信息
     */
    @PostConstruct
    private void init() {
        this.asset = properties.getAsset();
        this.address = properties.getAddress();
        this.pubfiles = properties.getPubfiles();
        this.prifiles = properties.getPrifiles();
    }


    public FTPClient connect() {
        FTPClient ftpClient = clientProvider.getClient(address, properties.getPort(),
                properties.getUsername(), properties.getPassword(), properties.getEncoding());
        log.debug("Got the client to minIO server {}.", address);
        return ftpClient;
    }

    /**
     * 上传文件
     *
     * @param bucket   文件桶 = 公开访问或者非公开文件
     * @param file     文件对象
     * @param fileInfo 文件信息
     * @return 是否上传成功
     */
    public boolean upload(String bucket, MultipartFile file, FileInfo fileInfo) {
        InputStream inputStream = null;
        try {
            inputStream = file.getInputStream();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return upload(bucket, inputStream, fileInfo);

    }

    public boolean upload(String bucket, InputStream inputStream, FileInfo fileInfo) {
        FTPClient ftpClient = connect();
        try {
            String destFileName = checkBucket(bucket) + fileInfo.getUri();
            List<String> dirList = Arrays.stream(destFileName.split("/")).collect(Collectors.toList());
            String fileName = dirList.get(dirList.size() - 1);
            dirList = dirList.subList(0, dirList.size() - 1);
            for (String dir : dirList) {
                if (!ftpClient.changeWorkingDirectory(dir)) {
                    ftpClient.makeDirectory(dir);
                    ftpClient.changeWorkingDirectory(dir);
                }
            }
            boolean fileFlag = ftpClient.storeFile(fileName, inputStream);
            boolean thumbnailFlag = false;
            if (fileInfo.getIsImage() && bucket.equals("pub")) {
                byte[] thumbnailBytes = FileStoreServiceUtil.thumbnail(inputStream, fileInfo);
                thumbnailFlag = ftpClient.storeFile(fileInfo.getThumbnailFileName(), new ByteArrayInputStream(thumbnailBytes));
            }
            return fileFlag && thumbnailFlag;
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            try {
                ftpClient.logout();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    /**
     * 删除文件
     *
     * @param bucket       文件桶 = 公开访问或者非公开文件
     * @param destFileName 文件路径+名称
     * @return 是否删除成功
     */
    public boolean delete(String bucket, String destFileName) {
        destFileName = checkBucket(bucket) + destFileName;
        FTPClient ftpClient = connect();
        try {
            return ftpClient.deleteFile(destFileName);
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            try {
                ftpClient.logout();
            } catch (IOException e) {
                log.error("error: {}", e.getMessage());
            }
        }
    }

    /**
     * 获取到文件输入流
     *
     * @param bucket       文件桶 = 公开访问或者非公开文件
     * @param destFileName 文件路径
     * @return 文件流
     */
    public InputStream getStream(String bucket, String destFileName) {
        destFileName = checkBucket(bucket) + destFileName;
        FTPClient ftpClient = connect();
        try {
            return ftpClient.retrieveFileStream(destFileName);
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            try {
                ftpClient.logout();
            } catch (IOException e) {
                log.error("error: {}", e.getMessage());
            }
        }
    }

    private String checkBucket(String bucket) {
        if (bucket.equals("pub")) {
            return pubfiles + "/";
        } else if (bucket.equals("pri")) {
            return prifiles + "/";
        } else {
            throw new CustomException("ftp文件上传文件错误");
        }
    }
}

