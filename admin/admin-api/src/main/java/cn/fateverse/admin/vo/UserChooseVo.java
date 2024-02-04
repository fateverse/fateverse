package cn.fateverse.admin.vo;

import cn.fateverse.admin.entity.Role;
import cn.fateverse.admin.entity.Dept;
import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Clay
 * @date 2023-03-02
 */
@Data
@Builder
public class UserChooseVo {

    private Long id;

    private String name;

    private Integer type;

    private String value;

    private String avatar;

    private List<UserChooseVo> children;


    public static UserChooseVo toUserChooseByDept(Dept dept, Long id) {
        return UserChooseVo.builder()
                .id(dept.getDeptId())
                .type(2)
                .value(id + "-" + dept.getDeptId())
                .children(new ArrayList<>())
                .name(dept.getDeptName())
                .build();
    }

    public static UserChooseVo toUserChooseByRole(Role role) {
        return UserChooseVo.builder()
                .id(role.getRoleId())
                .type(1)
                .value("0-" + role.getRoleId())
                .children(new ArrayList<>())
                .name(role.getRoleName())
                .build();
    }

    public static UserChooseVo toUserChooseByUser(UserVo user, long id) {
        return UserChooseVo.builder()
                .id(user.getUserId())
                .type(0)
                .value(id + "-" + user.getUserId())
                .children(new ArrayList<>())
                .avatar(user.getAvatar())
                .name(user.getNickName())
                .build();
    }
}
