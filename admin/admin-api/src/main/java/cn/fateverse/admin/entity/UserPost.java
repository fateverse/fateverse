package cn.fateverse.admin.entity;

import lombok.Builder;
import lombok.Data;

/**
 * @author Clay
 * @date 2022/11/26
 */
@Data
@Builder
public class UserPost {
    /**
     * 用户id
     */
    private Long userId;

    /**
     * 角色id
     */
    private Long postId;

}
