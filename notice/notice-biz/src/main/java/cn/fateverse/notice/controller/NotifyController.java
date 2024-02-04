package cn.fateverse.notice.controller;

import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.LongUtils;
import cn.fateverse.notice.entity.vo.NotifyVo;
import cn.fateverse.notice.service.NotifyService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Clay
 * @date 2023-05-07
 */
@Api(value = "用户公告管理", tags = "用户公告管理")
@RestController
@RequestMapping("/notify")
public class NotifyController {

    private final NotifyService notifyService;

    public NotifyController(NotifyService notifyService) {
        this.notifyService = notifyService;
    }

    @ApiOperation("获取用户公告列表")
    @GetMapping
    public Result<TableDataInfo<NotifyVo>> list(String cluster, String state) {
        TableDataInfo<NotifyVo> table = notifyService.searchList(cluster, state);
        return Result.ok(table);
    }

    @ApiOperation("获取用户公告详细信息")
    @GetMapping("/{noticeId}")
    public Result<NotifyVo> info(@PathVariable Long noticeId) {
        if (LongUtils.isNull(noticeId)) {
            return Result.error("公告id不能为空");
        }
        NotifyVo notify = notifyService.searchById(noticeId);
        if (null == notify){
            return Result.error("获取数据失败!");
        }
        return Result.ok(notify);
    }

    @ApiOperation("已读消息")
    @PutMapping("/read/{noticeId}")
    public Result<Void> read(@PathVariable Long noticeId) {
        if (LongUtils.isNull(noticeId)) {
            return Result.error("公告id不能为空");
        }
        notifyService.read(noticeId);
        return Result.ok();
    }

    @ApiOperation("全部已读消息")
    @PutMapping("/read/all")
    public Result<Void> readAll() {
        notifyService.readAll();
        return Result.ok();
    }

    @ApiOperation("删除消息")
    @DeleteMapping("/{noticeId}")
    public Result<Void> remove(@PathVariable Long noticeId) {
        if (LongUtils.isNull(noticeId)) {
            return Result.error("公告id不能为空");
        }
        notifyService.remove(noticeId);
        return Result.ok();
    }

    @ApiOperation("删除所有消息")
    @DeleteMapping("/batch/{noticeIds}")
    public Result<Void> batch(@PathVariable List<Long> noticeIds) {
        if (null == noticeIds || noticeIds.isEmpty()){
            return Result.error("参数不能为空");
        }
        notifyService.batchRemove(noticeIds);
        return Result.ok();
    }

    @ApiOperation("删除所有消息")
    @DeleteMapping("/all")
    public Result<Void> remove() {
        notifyService.removeAll();
        return Result.ok();
    }

}
