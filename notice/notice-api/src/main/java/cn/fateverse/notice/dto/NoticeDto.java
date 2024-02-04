package cn.fateverse.notice.dto;

import cn.fateverse.notice.enums.ActionEnums;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;

/**
 * @author Clay
 * @date 2023-05-04
 */
@Data
@ApiModel("公告发送实体")
public class NoticeDto implements Serializable {

    @ApiModelProperty("公告标题")
    @NotNull(message = "公告标题不能为空")
    private String noticeTitle;

    @ApiModelProperty("公告类型（1通知 2公告）")
    @NotNull(message = "公告类型不能为空")
    private String noticeType;

    @ApiModelProperty("发送类型,用户:user,用户数组:user,角色:role,部门:dept,全发:all")
    @NotNull(message = "发送类型不能为空")
    private String sendType;

    private ActionEnums action;

    @ApiModelProperty("发送类型的id")
    @NotNull(message = "发送对象id不能为空")
    private List<Long> senderIds;

    @ApiModelProperty("公告内容")
    private String noticeContent;

    @ApiModelProperty("内容类型: html,text 等")
    @NotNull(message = "内容类型不能为空")
    private String contentType;

    @ApiModelProperty("发送群组")
    @NotNull(message = "消息发送群组不能为空")
    private String cluster;

    @ApiModelProperty("公告备注")
    private String remark;

}
