package cn.fateverse.admin.dubbo;

import java.util.List;

/**
 * @author Clay
 * @date 2023-05-06
 */
public interface DubboRoleService {

    /**
     * 根据角色id获取到角色name
     *
     * @param roleIds 角色id
     * @return 角色名称
     */
    List<String> searchRoleNameByIds(List<Long> roleIds);
}
