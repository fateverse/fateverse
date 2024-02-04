package cn.fateverse.code.entity;

import cn.fateverse.common.core.entity.BaseEntity;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author Clay
 * @date 2022/11/15
 */
@Data
@ApiModel("关联表实体")
public class RelTable extends BaseEntity {

    /**
     * 关联表id
     */
    @ApiModelProperty("关联表id")
    private Long relTableId;
    /**
     * 主表id
     */
    @ApiModelProperty("主表id")
    private Long tableId;
    /**
     * 关联子表表名
     */
    @ApiModelProperty("关联子表表名")
    private String relName;
    /**
     * 子表简称
     */
    @ApiModelProperty("子表简称")
    private String relAs;
    /**
     * 父表名称
     */
    @ApiModelProperty("父表名称")
    private String tableName;
    /**
     * 父表名简称
     */
    @ApiModelProperty("父表名简称")
    private String tableAs;
    /**
     * 表描述
     */
    @ApiModelProperty("表描述")
    private String relComment;
    /**
     * 关联子表的字段
     */
    @ApiModelProperty("关联子表的字段")
    private String relColumn;
    /**
     * 关联父表字段
     */
    @ApiModelProperty("关联父表字段")
    private String tableColumn;
    /**
     * 实体类名称(子表)
     */
    @ApiModelProperty("实体类名称(子表)")
    private String relClass;
    /**
     * 实体类名称(子表)小写
     */
    @ApiModelProperty("实体类名称(子表)小写")
    private String relClassLower;
    /**
     * 关联类型
     */
    @ApiModelProperty("关联类型")
    private String queryType;
    /**
     * 排序
     */
    @ApiModelProperty("排序")
    private String sort;
}
