package cn.fateverse.notice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author Clay
 * @date 2023-05-04
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserNotice {

    private Long noticeId;

    private Long userId;

    private String state;

    private Date createTime;

}
