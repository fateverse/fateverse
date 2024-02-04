package cn.fateverse.code.entity.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author Clay
 * @date 2022/11/18
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("代码生成table表格list 返回实体")
public class TableVo {

    /**
     * 编号
     */
    @ApiModelProperty("编号")
    private Long tableId;

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
    /**
     * 实体类名称
     */
    @ApiModelProperty("实体类名称")
    private String className;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;
}
