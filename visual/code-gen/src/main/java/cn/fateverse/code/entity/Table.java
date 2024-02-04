package cn.fateverse.code.entity;

import cn.fateverse.code.entity.vo.TableVo;
import cn.fateverse.code.enums.BackTemplateEnum;
import cn.fateverse.code.enums.DynamicSourceEnum;
import cn.fateverse.code.enums.FrontTemplateEnum;
import cn.fateverse.common.core.entity.BaseEntity;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Clay
 * @date 2022/11/15
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("代码生成表格")
public class Table extends BaseEntity {

    /**
     * 编号
     */
    @ApiModelProperty("编号")
    private Long tableId;

    private Long parentMenuId;
    /**
     * 数据源id
     */
    @ApiModelProperty("数据源id")
    private Long dataSourceId;

    @ApiModelProperty("数据源类型")
    private DynamicSourceEnum dataSourceType;

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
     * 关联子表的表名
     */
    @ApiModelProperty("关联子表的表名")
    private String subTableName;

    /**
     * 子表关联的外键名
     */
    @ApiModelProperty("子表关联的外键名")
    private String subTableFkName;

    /**
     * 实体类名称
     */
    @ApiModelProperty("实体类名称")
    private String className;

    /**
     * 使用的模板（crud单表操作 tree树表操作）
     */
    @ApiModelProperty("使用的模板")
    private String tplCategory;

    /**
     * 生成包路径
     */
    @ApiModelProperty("生成包路径")
    private String packageName;

    /**
     * 生成模块名
     */
    @ApiModelProperty("生成模块名")
    private String moduleName;

    /**
     * 生成服务名
     */
    @ApiModelProperty("生成服务名")
    private String serviceName;

    /**
     * 生成业务名
     */
    @ApiModelProperty("生成业务名")
    private String businessName;

    /**
     * 生成功能名
     */
    @ApiModelProperty("生成功能名")
    private String functionName;

    /**
     * 生成功能作者
     */
    @ApiModelProperty("生成功能作者")
    private String functionAuthor;

    @ApiModelProperty("后端模板 0: mybatis 1: mybatispuls ")
    private BackTemplateEnum backTemplate;

    @ApiModelProperty("前端模板 0: vue 1: react")
    private FrontTemplateEnum frontTemplate;

    /**
     * 其它生成选项
     */
    @ApiModelProperty("其它生成选项")
    private String options;


    private String optionApi;


    public TableVo toTableVo(){
       return TableVo.builder()
                .tableId(tableId)
                .dataSourceId(dataSourceId)
                .tableName(tableName)
                .tableComment(tableComment)
                .className(className)
                .createTime(getCreateTime())
                .updateTime(getUpdateTime())
                .build();
    }
}
