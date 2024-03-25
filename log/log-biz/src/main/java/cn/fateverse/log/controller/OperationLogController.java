package cn.fateverse.log.controller;

import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.log.query.OperationLogQuery;
import cn.fateverse.log.service.OperationService;
import cn.fateverse.log.vo.OperationLogVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


/**
 * 操作日志控制器
 *
 * @author Clay
 * @date 2022/11/1
 */
@Slf4j
@RestController
@RequestMapping("/log")
public class OperationLogController {

    private final OperationService operationService;

    public OperationLogController(OperationService operationService) {
        this.operationService = operationService;
    }

    @GetMapping("/list")
    @PreAuthorize("@ss.hasPermission('admin:log:list')")
    public Result<TableDataInfo<OperationLogVo>> SearchLog(OperationLogQuery operationLogQuery) {
        TableDataInfo<OperationLogVo> dataTable = operationService.search(operationLogQuery);
        return Result.ok(dataTable);
    }

    @GetMapping("/{operId}")
    @PreAuthorize("@ss.hasPermission('admin:log:list')")
    public Result<OperationLogVo> SearchLog(@PathVariable Long operId) {
        OperationLogVo operationLogVo = operationService.select(operId);
        return Result.ok(operationLogVo);
    }

    @DeleteMapping("/{operIds}")
    @PreAuthorize("@ss.hasPermission('admin:log:del')")
    public Result<Integer> OperationInfoRemove(@PathVariable Long[] operIds) {
        if (operIds.length == 0) {
            return Result.error("id不能为空");
        }
        operationService.delete(operIds);
        return Result.ok();
    }


}
