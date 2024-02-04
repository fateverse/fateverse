package cn.fateverse.code.entity.query;

import cn.fateverse.common.core.entity.QueryTime;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;


/**
 * @author Clay
 * @date 2022/11/17
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DynamicTable extends QueryTime {

    /**
     * 表名称
     */
    @ApiModelProperty("表名称")
    private String tableName;

    /**
     * 表注释
     */
    @ApiModelProperty("表注释")
    private String tableComment;

    private Date createTime;

    private Date updateTime;
}
