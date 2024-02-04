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
@ApiModel("关联表列名称")
public class RelTableColumn extends BaseEntity {

    /**
     * 子表字段id
     */
    @ApiModelProperty("子表字段id")
    private Long relColumnId;
    /**
     * 归属表编号
     */
    @ApiModelProperty("归属表编号")
    private Long relTableId;
    /**
     * 列名称
     */
    @ApiModelProperty("列名称")
    private String columnName;
    /**
     * 列描述
     */
    @ApiModelProperty("列描述")
    private String columnComment;
    /**
     * 列类型
     */
    @ApiModelProperty("列类型")
    private String columnType;
    /**
     * JAVA类型
     */
    @ApiModelProperty("JAVA类型")
    private String javaType;
    /**
     * JAVA字段名
     */
    @ApiModelProperty("JAVA字段名")
    private String javaField;
    /**
     * 是否列表字段（1是）
     */
    @ApiModelProperty("是否列表字段（1是）")
    private String isList;
    /**
     * 是否查询字段（1是）
     */
    @ApiModelProperty("是否查询字段（1是）")
    private String isQuery;
    /**
     * 查询方式（等于、不等于、大于、小于、范围）
     */
    @ApiModelProperty("查询方式（等于、不等于、大于、小于、范围）")
    private String queryType;
    /**
     * 显示类型（文本框、文本域、下拉框、复选框、单选框、日期控件）
     */
    @ApiModelProperty("显示类型（文本框、文本域、下拉框、复选框、单选框、日期控件）")
    private String htmlType;
    /**
     * 字典类型
     */
    @ApiModelProperty("字典类型")
    private String dictType;
    /**
     * 排序
     */
    @ApiModelProperty("排序")
    private String sort;

}
