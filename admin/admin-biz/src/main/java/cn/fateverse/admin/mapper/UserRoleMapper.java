package cn.fateverse.admin.mapper;


import cn.fateverse.admin.entity.UserRole;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/6
 */
public interface UserRoleMapper {

    /**
     * 批量新增用户角色映射关系
     *
     * @param list
     * @return
     */
    int batchInsert(List<UserRole> list);

    /**
     * 根据用户id删除角色菜单映射表
     *
     * @param userId
     * @return
     */
    int deleteByUserId(Long userId);

    /**
     * 根据角色删除映射关系
     *
     * @param roleId
     * @return
     */
    int deleteByRoleId(Long roleId);

    /**
     * 解除用户于角色之前的绑定关系
     *
     * @param userIds
     * @param roleId
     * @return
     */
    int unBind(@Param("userIds") List<Long> userIds, @Param("roleId") Long roleId);

    /**
     * 用户于角色之前的绑定关系
     *
     * @param userIds
     * @param roleId
     * @return
     */
    int bind(@Param("userIds") List<Long> userIds, @Param("roleId") Long roleId);

}
