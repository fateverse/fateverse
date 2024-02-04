package cn.fateverse.admin.mapper;

import cn.fateverse.admin.entity.UserPost;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/26
 */
public interface UserPostMapper {
    /**
     * 批量新增用户角色映射关系
     *
     * @param list
     * @return
     */
    int batchInsert(List<UserPost> list);

    /**
     * 获取用户对应的岗位id
     *
     * @param userId
     * @return
     */
    List<Long> selectPostIdListByUserId(Long userId);

    /**
     * 根据用户id删除角色菜单映射表
     *
     * @param userId
     * @return
     */
    int deleteByUserId(Long userId);

    /**
     * 解除用户于角色之前的绑定关系
     *
     * @param userIds
     * @param postId
     * @return
     */
    int removeBind(@Param("userIds") List<Long> userIds, @Param("postId") Long postId);

    /**
     * 接触当前岗位与所有用户的绑定关系
     *
     * @param postId 岗位id
     * @return 执行结果
     */
    int removeBindByPostId(Long postId);
}
