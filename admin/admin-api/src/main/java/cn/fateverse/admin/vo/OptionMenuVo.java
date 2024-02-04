package cn.fateverse.admin.vo;

import cn.fateverse.common.core.entity.OptionTree;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Set;

/**
 * @author Clay
 * @date 2022/11/6
 */
@Data
@Builder
@ApiModel("角色修改时菜单返回实体")
public class OptionMenuVo {

    @ApiModelProperty("已选择的")
    private Set<Long> checked;
    @ApiModelProperty("菜单选择option")
    private List<OptionTree> menuOption;

}
