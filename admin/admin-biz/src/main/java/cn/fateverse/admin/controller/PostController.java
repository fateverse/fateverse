package cn.fateverse.admin.controller;

import cn.fateverse.admin.dto.PostDto;
import cn.fateverse.admin.query.PostQuery;
import cn.fateverse.admin.entity.Post;
import cn.fateverse.admin.service.PostService;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.LongUtils;
import cn.fateverse.common.log.annotation.Log;
import cn.fateverse.common.log.enums.BusinessType;
import cn.fateverse.common.mybatis.utils.PageUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
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
    public Result<TableDataInfo<Post>> list(PostQuery query) {
        PageUtils.startPage();
        List<Post> dictTypeList = postService.searchList(query);
        TableDataInfo<Post> dataTable = PageUtils.getDataTable(dictTypeList);
        return Result.ok(dataTable);
    }


    @ApiOperation("查询岗位列表")
    @GetMapping("/info/{postId}")
    @PreAuthorize("@ss.hasPermission('admin:dict:info')")
    public Result<Post> info(@PathVariable Long postId) {
        checkPostId(postId);
        Post post = postService.searchById(postId);
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
    public Result<Void> add(@RequestBody @Validated Post post) {
        checkPostInfo(post, "新增");
        postService.save(post);
        return Result.ok();
    }

    @ApiOperation("编辑岗位")
    @PutMapping
    @PreAuthorize("@ss.hasPermission('admin:dict:edit')")
    @Log(title = "编辑岗位", businessType = BusinessType.UPDATE)
    public Result<Void> edit(@RequestBody @Validated PostDto postDto) {
        Post post = new Post();
        BeanUtils.copyProperties(postDto,post);
        checkPostId(post.getPostId());
        checkPostInfo(post, "修改");
        postService.edit(post);
        return Result.ok();
    }

    @ApiOperation("删除岗位")
    @DeleteMapping("/{postId}")
    @PreAuthorize("@ss.hasPermission('admin:dict:del')")
    @Log(title = "删除岗位", businessType = BusinessType.DELETE)
    public Result<Void> del(@PathVariable Long postId) {
        checkPostId(postId);
        if (postService.hasUserByRoleId(postId)) {
            return Result.error("当前岗位下还存在用户,不允许删除!");
        }
        postService.removeById(postId);
        return Result.ok();
    }

    private void checkPostInfo(Post post, String type) {
        if (postService.checkCodeUnique(post)) {
            throw new CustomException(type + post.getPostName() + "岗位名称失败,岗位代码已存在!");
        }
        if (postService.checkNameUnique(post)) {
            throw new CustomException(type + post.getPostName() + "岗位名称失败,岗位名称已存在!");
        }
    }


    private void checkPostId(Long postId) {
        if (LongUtils.isNull(postId)) {
            throw new CustomException("id不能为空!");
        }
    }

}
