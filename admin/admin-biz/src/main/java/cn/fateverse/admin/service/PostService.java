package cn.fateverse.admin.service;

import cn.fateverse.admin.query.PostQuery;
import cn.fateverse.admin.entity.Post;
import cn.fateverse.common.core.entity.Option;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/26
 */
public interface PostService {


    /**
     * 查询岗位列表
     *
     * @param query
     * @return
     */
    List<Post> searchList(PostQuery query);

    /**
     * 获取岗位的选择option选项
     *
     * @return
     */
    List<Option> searchOption();

    /**
     * 根据岗位id查询岗位信息
     *
     * @param id
     * @return
     */
    Post searchById(Long id);

    /**
     * 校验岗位代码是否唯一
     *
     * @param post
     * @return
     */
    boolean checkCodeUnique(Post post);

    /**
     * 校验岗位名称是否唯一
     *
     * @param post
     * @return
     */
    boolean checkNameUnique(Post post);

    /**
     * 当前岗位下时候还有用户
     * @param postId
     * @return
     */
    boolean hasUserByRoleId(Long postId);

    /**
     * 保存岗位信息
     *
     * @param post
     * @return
     */
    int save(Post post);

    /**
     * 编辑岗位信息
     *
     * @param post
     * @return
     */
    int edit(Post post);

    /**
     * 删除岗位信息
     *
     * @param id
     * @return
     */
    int removeById(Long id);
}
