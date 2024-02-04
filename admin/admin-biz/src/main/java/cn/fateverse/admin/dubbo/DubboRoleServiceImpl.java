package cn.fateverse.admin.dubbo;

import cn.fateverse.admin.entity.Role;
import cn.fateverse.admin.mapper.RoleMapper;
import cn.fateverse.admin.query.RoleQuery;
import org.apache.dubbo.config.annotation.DubboService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author Clay
 * @date 2023-05-06
 */
@DubboService
public class DubboRoleServiceImpl implements DubboRoleService {


    private final RoleMapper roleMapper;

    public DubboRoleServiceImpl(RoleMapper roleMapper) {
        this.roleMapper = roleMapper;
    }


    @Override
    public List<String> searchRoleNameByIds(List<Long> roleIds) {
        RoleQuery query = new RoleQuery();
        query.setState("0");
        List<Role> roleList = roleMapper.selectByIds(roleIds);
        if (null == roleList||roleList.isEmpty()){
            return new ArrayList<>();
        }
        return roleList.stream().map(Role::getRoleName).collect(Collectors.toList());
    }
}
