package cn.fateverse.admin.service.impl;

import cn.fateverse.admin.query.PostQuery;
import cn.fateverse.admin.entity.Post;
import cn.fateverse.admin.mapper.PostMapper;
import cn.fateverse.admin.service.PostService;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.enums.StateEnum;
import cn.fateverse.common.core.utils.LongUtils;
import cn.fateverse.common.core.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
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
    public List<Post> searchList(PostQuery query) {
        return postMapper.selectList(query);
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
    public Post searchById(Long id) {
        return postMapper.selectById(id);
    }


    @Override
    public boolean checkCodeUnique(Post post) {
        Long postId = getPostId(post);
        Post info = postMapper.selectByPostCode(post.getPostCode());
        return checkDictType(info,postId);
    }

    @Override
    public boolean checkNameUnique(Post post) {
        Long postId = getPostId(post);
        Post info = postMapper.selectByPostName(post.getPostName());
        return checkDictType(info,postId);
    }

    @Override
    public boolean hasUserByRoleId(Long postId) {
        return postMapper.hasUserByPostId(postId) == 1;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int save(Post post) {
        return postMapper.insert(post);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int edit(Post post) {
        return postMapper.update(post);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int removeById(Long id) {
        return postMapper.deleteById(id);
    }

    private Long getPostId(Post post) {
        return LongUtils.isNull(post.getPostId()) ? 0L : post.getPostId();
    }

    private boolean checkDictType(Post info, Long postId) {
        return (!ObjectUtils.isEmpty(info) && !info.getPostId().equals(postId));
    }
}
