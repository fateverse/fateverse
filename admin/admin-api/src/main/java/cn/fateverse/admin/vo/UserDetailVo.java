package cn.fateverse.admin.vo;

import cn.fateverse.admin.entity.User;
import cn.fateverse.common.core.entity.Option;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/4
 */
@Data
@Builder
@ApiModel("用户详细信息")
public class UserDetailVo {
    @ApiModelProperty("用户基本细腻系")
    private User user;

    @ApiModelProperty("用户所在的岗位")
    private List<Long> postIds;

    @ApiModelProperty("岗位option选择数组")
    private List<Option> postList;

    @ApiModelProperty("用户所拥有的的角色信息")
    private List<Long> roleIds;

    @ApiModelProperty("角色option选择数组")
    private List<Option> roleList;
}
