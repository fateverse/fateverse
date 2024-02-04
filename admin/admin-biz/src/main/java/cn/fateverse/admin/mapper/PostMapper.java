package cn.fateverse.admin.mapper;

import cn.fateverse.admin.query.PostQuery;
import cn.fateverse.admin.entity.Post;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/26
 */
public interface PostMapper {

    /**
     * 查询岗位列表
     *
     * @param query
     * @return
     */
    List<Post> selectList(PostQuery query);

    /**
     * 根据id查询岗位信息
     *
     * @param id
     * @return
     */
    Post selectById(Long id);

    /**
     * 根据岗位code查询岗位信息
     *
     * @param postCode
     * @return
     */
    Post selectByPostCode(String postCode);

    /**
     * 根据岗位名称查询岗位信息
     *
     * @param postName
     * @return
     */
    Post selectByPostName(String postName);

    /**
     * 查询当前岗位下有多少用户
     *
     * @param postId
     * @return
     */
    int hasUserByPostId(Long postId);

    /**
     * 新增岗位
     *
     * @param post
     * @return
     */
    int insert(Post post);

    /**
     * 更新岗位
     *
     * @param post
     * @return
     */
    int update(Post post);

    /**
     * 删除岗位
     *
     * @param id
     * @return
     */
    int deleteById(Long id);

}
