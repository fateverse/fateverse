package cn.fateverse.admin.controller;

import cn.fateverse.admin.dto.PostDto;
import cn.fateverse.admin.query.PostQuery;
import cn.fateverse.admin.service.PostService;
import cn.fateverse.admin.vo.PostVo;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.LongUtils;
import cn.fateverse.common.log.annotation.Log;
import cn.fateverse.common.log.enums.BusinessType;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/26
 */

@Api(tags = "岗位管理")
@Slf4j
@RestController
@RequestMapping("/post")
public class PostController {


    private final PostService postService;


    public PostController(PostService postService) {
        this.postService = postService;
    }

    @ApiOperation("查询岗位列表")
    @GetMapping
    @PreAuthorize("@ss.hasPermission('admin:dict:list')")
    public Result<TableDataInfo<PostVo>> list(PostQuery query) {
        TableDataInfo<PostVo> dataTable = postService.searchList(query);
        return Result.ok(dataTable);
    }


    @ApiOperation("查询岗位列表")
    @GetMapping("/info/{postId}")
    @PreAuthorize("@ss.hasPermission('admin:dict:info')")
    public Result<PostVo> info(@PathVariable Long postId) {
        checkPostId(postId);
        PostVo post = postService.searchById(postId);
        return Result.ok(post);
    }


    @ApiOperation("获取select下拉框数据")
    @GetMapping("/option")
    public Result<List<Option>> option() {
        List<Option> optionList = postService.searchOption();
        return Result.ok(optionList);
    }

    @ApiOperation("新增岗位")
    @PostMapping
    @PreAuthorize("@ss.hasPermission('admin:dict:add')")
    @Log(title = "新增岗位", businessType = BusinessType.INSERT)
    public Result<Void> add(@RequestBody @Validated PostDto postDto) {
        postService.save(postDto);
        return Result.ok();
    }

    @ApiOperation("编辑岗位")
    @PutMapping
    @PreAuthorize("@ss.hasPermission('admin:dict:edit')")
    @Log(title = "编辑岗位", businessType = BusinessType.UPDATE)
    public Result<Void> edit(@RequestBody @Validated PostDto postDto) {
        checkPostId(postDto.getPostId());
        postService.edit(postDto);
        return Result.ok();
    }

    @ApiOperation("删除岗位")
    @DeleteMapping("/{postId}")
    @PreAuthorize("@ss.hasPermission('admin:dict:del')")
    @Log(title = "删除岗位", businessType = BusinessType.DELETE)
    public Result<Void> del(@PathVariable Long postId) {
        checkPostId(postId);
        postService.removeById(postId);
        return Result.ok();
    }


    private void checkPostId(Long postId) {
        if (LongUtils.isNull(postId)) {
            throw new CustomException("id不能为空!");
        }
    }

}
