package cn.fateverse.notice.controller;

import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.ObjectUtils;
import cn.fateverse.common.excel.utils.ExcelUtil;
import cn.fateverse.common.log.annotation.Log;
import cn.fateverse.common.log.enums.BusinessType;
import cn.fateverse.notice.dto.NoticeDto;
import cn.fateverse.notice.entity.query.NoticeQuery;
import cn.fateverse.notice.entity.vo.NoticeVo;
import cn.fateverse.notice.service.NoticeService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Clay
 * @date 2023-05-04
 */
@Api(value = "公告管理",tags = "公告管理")
@RestController
@RequestMapping("/notice")
public class NoticeController {

    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @ApiOperation("获取公告列表")
    @GetMapping
    @PreAuthorize("@ss.hasPermission('notice:notice:list')")
    public Result<TableDataInfo<NoticeVo>> list(NoticeQuery query) {
        TableDataInfo<NoticeVo> dataInfo = noticeService.searchList(query);
        return Result.ok(dataInfo);
    }

    @ApiOperation("导出excel数据")
    @GetMapping("/export")
    @PreAuthorize("@ss.hasPermission('notice:notice:export')")
    public void export(NoticeQuery query){
        List<NoticeVo> list = noticeService.exportList(query);
        ExcelUtil.exportExcel(list,NoticeVo.class);
    }

    @ApiOperation("获取万能查询详细信息")
    @GetMapping("/{noticeId}")
    @PreAuthorize("@ss.hasPermission('notice:notice:info')")
    public Result<NoticeVo> info(@PathVariable Long noticeId) {
        ObjectUtils.checkPk(noticeId);
        NoticeVo notice = noticeService.searchById(noticeId);
        return Result.ok(notice);
    }

    @ApiOperation("新增公告")
    @PostMapping
    @Log(title = "新增公告",businessType = BusinessType.INSERT)
    @PreAuthorize("@ss.hasPermission('notice:notice:add')")
    public Result<Void> add(@RequestBody @Validated NoticeDto dto){
        if (ObjectUtils.isEmpty(dto.getSenderIds())){
            return Result.error("发送对象不能为空!");
        }
        noticeService.save(dto);
        return Result.ok();
    }

    @ApiOperation("删除公告")
    @DeleteMapping("/{noticeId}")
    @Log(title = "删除公告",businessType = BusinessType.DELETE)
    @PreAuthorize("@ss.hasPermission('notice:notice:del')")
    public Result<Void> del(@PathVariable Long noticeId){
        ObjectUtils.checkPk(noticeId);
        noticeService.removeById(noticeId);
        return Result.ok();
    }

}
