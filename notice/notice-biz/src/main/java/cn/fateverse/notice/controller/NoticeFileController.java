package cn.fateverse.notice.controller;

import cn.hutool.core.util.StrUtil;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.file.entity.FileInfo;
import cn.fateverse.common.file.service.FileStoreService;
import cn.fateverse.common.file.service.impl.MinioFileStoreService;
import cn.fateverse.notice.entity.NoticeFile;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * @author Clay
 * @date 2023-08-01
 */
@Api(value = "文件上传", tags = "文件上传")
@RestController
@RequestMapping("/file")
public class NoticeFileController {

    private final FileStoreService fileStoreService;

    public NoticeFileController(MinioFileStoreService fileStoreService) {
        this.fileStoreService = fileStoreService;
    }

   private final Set<String> fileType = new HashSet<>(Arrays.asList("pdf", "txt", "zip", "rar", "7z", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "mp3", "mp4", "jpg", "jpeg", "png", "gif", "mp3", "mp4"));


    @ApiOperation("上传文件")
    @PostMapping
    public Result<NoticeFile> uploadFile(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        if (StrUtil.isBlank(fileName)){
            return Result.error("无文件名!");
        }
        int dotIndex = fileName.lastIndexOf('.');
        if (!(dotIndex > 0 && dotIndex < fileName.length() - 1)) {
            return Result.error("文件不不合法!");
        }
        String extension = fileName.substring(dotIndex + 1).toLowerCase();
        if (!fileType.contains(extension)){
            return Result.error("文件类型不合法!");
        }
        FileInfo upload = fileStoreService.upload(file);
        NoticeFile noticeFile = NoticeFile.builder()
                .url(upload.getUrl())
                .isImage(upload.getIsImage())
                .size(upload.getSize())
                .build();
        return Result.ok(noticeFile);
    }

}
