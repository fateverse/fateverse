package cn.fateverse.common.file.utils;

import cn.fateverse.common.core.utils.HttpServletUtils;
import cn.fateverse.common.file.entity.FileInfo;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.jetbrains.annotations.NotNull;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.Arrays;
import java.util.Date;
import java.util.UUID;
import java.util.function.Consumer;

/**
 * 对象存储服务工具
 *
 * @author Clay
 * @date 2023-02-16
 */
public class FileStoreServiceUtil {

    // 允许上传文件(图片)的格式
    public static final String[] IMAGE_TYPE = new String[]{"bmp", "jpg",
            "jpeg", "gif", "png"};


    public static FileInfo getOssFile(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        return getFileInfo(file.getSize(), originalFilename);
    }

    @NotNull
    public static FileInfo getFileInfo(InputStream file, String originalFilename) {
        try {
            return getFileInfo(file.available(),originalFilename);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    @NotNull
    public static FileInfo getFileInfo(long fileSize, String originalFilename) {
        // 获取文件类型
        assert originalFilename != null;
        String fileType = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
        UUID uuid = UUID.randomUUID();
        String fileName = uuid + "." + fileType;
        String format = DateFormatUtils.format(new Date(), "yyyy/MM/dd");
        //根据时间拼接url
        String uri = format + "/" + fileName;
        FileInfo fileInfo = FileInfo.builder()
                .fileName(fileName)
                .originalFilename(originalFilename)
                .uri(uri)
                .path(format)
                .fileType(fileType)
                .size(fileSize)
                .build();
        fileInfo.setIsImage(Arrays.asList(IMAGE_TYPE).contains(fileType));
        if (fileInfo.getIsImage()){
            fileInfo.setThumbnailUri(format+"/"+fileInfo.getThumbnailFileName());
            fileInfo.setThumbnailFileName(uuid + ".min." + fileType);
        }
        return fileInfo;
    }


    public static void writeTo(InputStream inputStream, OutputStream os) throws IOException {
        byte[] bytes = new byte[1024];
        int len;
        while ((len = inputStream.read(bytes)) != -1) {
            os.write(bytes, 0, len);
        }
        os.flush();
    }

    public static InputStream getInputStream(MultipartFile file) {
        // 获取oss的地域节点
        try {
            return file.getInputStream();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    /**
     * 生成缩略图并缩放到指定大小，默认输出图片格式通过 thumbnailSuffix 获取
     *
     * @return
     */
    public static byte[] thumbnail(int width, int height, InputStream inputStream, FileInfo fileInfo) {
        return thumbnail(th -> th.size(width, height), inputStream, fileInfo);
    }


    /**
     * 通过指定 InputStream 生成缩略图并进行图片处理，
     * 可以进行裁剪、旋转、缩放、水印等操作，默认输出图片格式通过 thumbnailSuffix 获取，
     * 操作完成后会自动关闭 InputStream
     *
     * @return
     */
    public static byte[] thumbnail(Consumer<Thumbnails.Builder<? extends InputStream>> consumer, InputStream in, FileInfo fileInfo) {
        try {
            Thumbnails.Builder<? extends InputStream> builder = Thumbnails.of(in);
            //builder.outputFormat(file.getFileType());
            consumer.accept(builder);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            builder.toOutputStream(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("生成缩略图失败！", e);
        }
    }


    public static byte[] thumbnail(InputStream inputStream, FileInfo fileInfo) {
        return thumbnail(200, 200, inputStream, fileInfo);
    }


    public static void downloadFile(InputStream inputStream, String fileName){
        HttpServletResponse response = HttpServletUtils.getResponse();
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int length;
            while ((length = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, length);
            }
            byte[] bytes = outputStream.toByteArray();
            IOUtils.write(bytes,response.getOutputStream());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        response.setCharacterEncoding("utf-8");
        response.setContentType("multipart/form-data");
        response.setHeader("Content-Disposition" ,
                "attachment;fileName=" + fileName);
    }
}
