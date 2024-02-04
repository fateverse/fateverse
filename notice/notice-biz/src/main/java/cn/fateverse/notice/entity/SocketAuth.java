package cn.fateverse.notice.entity;

import lombok.Data;

/**
 * @author Clay
 * @date 2023-05-04
 */
@Data
public class SocketAuth {

    private String type;

    private String token;

    private String cluster;

}
