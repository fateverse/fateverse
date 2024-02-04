package cn.fateverse.notice.entity.query;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author Clay
 * @date 2023-05-05
 */
@Data
public class NoticeQuery {

    @ApiModelProperty("公告标题")
    private String noticeTitle;

    @ApiModelProperty("公告类型（1通知 2公告）")
    private String noticeType;

    @ApiModelProperty("发送类型,用户,用户数组,角色,部门,全发")
    private String sendType;

    @ApiModelProperty("内容类型: html,text等")
    private String contentType;

    @ApiModelProperty("公告状态（0正常 1关闭）")
    private String state;

    @ApiModelProperty("群组")
    private String cluster;

    @JsonIgnore
    private Long publishId;

}
