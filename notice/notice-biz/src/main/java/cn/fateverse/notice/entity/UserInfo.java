package cn.fateverse.notice.entity;

import io.netty.channel.ChannelId;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Set;

/**
 * @author Clay
 * @date 2023-04-16
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserInfo implements Serializable {

    private String userId;

    private String redisKey;

    private String routingKey;

    private String cluster;

    private Set<Long> roleSet;

    private Long deptId;

    private Set<Long> deptAncestors;

}
