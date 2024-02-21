package cn.fateverse.admin.service.impl;

import cn.fateverse.admin.dto.PostDto;
import cn.fateverse.admin.query.PostQuery;
import cn.fateverse.admin.entity.Post;
import cn.fateverse.admin.mapper.PostMapper;
import cn.fateverse.admin.service.PostService;
import cn.fateverse.admin.vo.PostVo;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.enums.StateEnum;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.ObjectUtils;
import cn.fateverse.common.mybatis.utils.PageUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author Clay
 * @date 2022/11/26
 */
@Slf4j
@Service
public class PostServiceImpl implements PostService {


    private final PostMapper postMapper;

    public PostServiceImpl(PostMapper postMapper) {
        this.postMapper = postMapper;
    }

    @Override
    public TableDataInfo<PostVo> searchList(PostQuery query) {
        List<Post> list = postMapper.selectList(query);
        return PageUtils.convertDataTable(list, PostVo::toPostVo);
    }

    @Override
    public List<Option> searchOption() {
        PostQuery query = new PostQuery();
        query.setState(StateEnum.NORMAL.getCode());
        List<Post> postList = postMapper.selectList(query);
        return postList.stream().map(post -> Option.builder()
                .value(post.getPostId())
                .label(post.getPostName())
                .build()).collect(Collectors.toList());
    }

    @Override
    public PostVo searchById(Long id) {
        Post post = postMapper.selectById(id);
        if (post == null){
            throw new CustomException("查询结果为空!");
        }
        return PostVo.toPostVo(post);
    }


    private boolean checkCodeUnique(Long postId,String postCode) {
        Post info = postMapper.selectByPostCode(postCode);
        return checkDictType(info, postId);
    }

    private boolean checkNameUnique(Long postId,String postName) {
        Post info = postMapper.selectByPostName(postName);
        return checkDictType(info, postId);
    }

    @Override
    public boolean hasUserByRoleId(Long postId) {
        return postMapper.hasUserByPostId(postId) == 1;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int save(PostDto postDto) {
        checkPostInfo(postDto, "新增");
        Post post = new Post();
        BeanUtils.copyProperties(postDto, post);
        return postMapper.insert(post);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int edit(PostDto postDto) {
        checkPostInfo(postDto, "修改");
        Post post = new Post();
        BeanUtils.copyProperties(postDto, post);
        return postMapper.update(post);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int removeById(Long postId) {
        if (hasUserByRoleId(postId)) {
            throw new CustomException("当前岗位下还存在用户,不允许删除!");
        }
        return postMapper.deleteById(postId);
    }

    private boolean checkDictType(Post info, Long postId) {
        return (!ObjectUtils.isEmpty(info) && !info.getPostId().equals(postId));
    }

    private void checkPostInfo(PostDto post, String type) {
        if (checkCodeUnique(post.getPostId(),post.getPostCode())) {
            throw new CustomException(type + post.getPostName() + "岗位名称失败,岗位代码已存在!");
        }
        if (checkNameUnique(post.getPostId(),post.getPostName())) {
            throw new CustomException(type + post.getPostName() + "岗位名称失败,岗位名称已存在!");
        }
    }
}
