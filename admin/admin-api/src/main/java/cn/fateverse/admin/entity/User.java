package cn.fateverse.admin.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.List;

/**
 * @author Clay
 * @date 2022/10/27
 */
@Data
public class User extends UserBase {


    /**
     * 部门对象
     */
    private Dept dept;

    /**
     * 角色对象
     */
    private List<Role> roles;


    @JsonIgnore
    public boolean isAdmin() {
        return isAdmin(super.getUserId());
    }

    @JsonIgnore
    public static boolean isAdmin(Long userId) {
        return userId != null && 1L == userId;
    }
}
