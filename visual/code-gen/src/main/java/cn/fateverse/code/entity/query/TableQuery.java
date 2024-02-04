package cn.fateverse.code.entity.query;

import cn.fateverse.common.core.entity.QueryTime;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Clay
 * @date 2022/11/18
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("代码生成查询实体")
public class TableQuery extends QueryTime {

    /**
     * 数据源id
     */
    @ApiModelProperty("数据源id")
    private Long dataSourceId;

    /**
     * 表名称
     */
    @ApiModelProperty("表名称")
    private String tableName;

    /**
     * 表描述
     */
    @ApiModelProperty("表描述")
    private String tableComment;

    @ApiModelProperty("数据类型")
    private String dataSourceType;
}
