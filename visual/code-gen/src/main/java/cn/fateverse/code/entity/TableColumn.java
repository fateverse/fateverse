package cn.fateverse.code.entity;

import cn.hutool.core.util.StrUtil;
import cn.fateverse.code.util.constant.CodeGenConstants;
import cn.fateverse.common.core.annotaion.EnableAutoField;
import cn.fateverse.common.core.entity.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.ObjectUtils;

/**
 * @author Clay
 * @date 2022/11/15
 */
@Data
@EnableAutoField
@ApiModel("table表字段实体")
public class TableColumn extends BaseEntity {

    /**
     * 编号
     */
    @ApiModelProperty("编号")
    private Long columnId;
    /**
     * 归属表编号
     */
    @ApiModelProperty("归属表编号")
    private Long tableId;
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

    @ApiModelProperty("列长度")
    private Integer columnLength;

    @ApiModelProperty("列精度")
    private Integer columnScale;
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
     * 是否主键（1是）
     */
    @ApiModelProperty("是否主键（1是）")
    private String isPk;
    /**
     * 是否自增（1是）
     */
    @ApiModelProperty("是否自增（1是）")
    private String isIncrement;
    /**
     * 是否必填（1是）
     */
    @ApiModelProperty("是否必填（1是）")
    private String isRequired;
    /**
     * 是否为插入字段（1是）
     */
    @ApiModelProperty("是否为插入字段（1是）")
    private String isInsert;
    /**
     * 是否编辑字段（1是）
     */
    @ApiModelProperty("是否编辑字段（1是）")
    private String isEdit;
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
     * 是否正则(1 否)
     */
    @ApiModelProperty("是否正则(1 否)")
    private Long isRegular;
    /**
     * 正则表达式内容
     */
    @ApiModelProperty("正则表达式内容")
    private String regular;
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

    /**
     * 是否为主键
     *
     * @return
     */
    @JsonIgnore
    public Boolean isPk() {
        return isPk(this.isPk);
    }

    /**
     * 是否为主键
     *
     * @param isPk
     * @return
     */
    @JsonIgnore
    public Boolean isPk(String isPk) {
        return "1".equals(isPk);
    }

    /**
     * 是否为基础的列
     *
     * @return
     */
    @JsonIgnore
    public Boolean isSuperColumn() {
        return isSuperColumn(this.javaField);
    }

    @JsonIgnore
    public Boolean query() {
        return "1".equals(this.getIsQuery());
    }

    @JsonIgnore
    public Boolean from() {
        return "1".equals(isEdit) || "1".equals(isInsert);
    }

    @JsonIgnore
    public Boolean list() {
        return "1".equals(isList);
    }

    @JsonIgnore
    public Boolean required() {
        return "1".equals(isRequired);
    }

    @JsonIgnore
    public Boolean isRegular() {
        return !isRegular.equals(0L);
    }


    /**
     * 是否为基础的列
     *
     * @param javaField
     * @return
     */
    @JsonIgnore
    public static Boolean isSuperColumn(String javaField) {
        javaField = javaField.toLowerCase();
        return StringUtils.equalsAnyIgnoreCase(javaField,
                // BaseEntity
                "createBy", "createTime", "updateBy", "updateTime", "remark",
                // TreeEntity
                "parentName", "parentId", "orderNum", "ancestors");
    }

    @JsonIgnore
    public static Boolean isUsableColumn(String javaField) {
        // isSuperColumn()中的名单用于避免生成多余Entity属性，若某些属性在生成页面时需要用到不能忽略，则放在此处白名单
        return StringUtils.equalsAnyIgnoreCase(javaField, "parentId", "orderNum", "remark");
    }

    @JsonIgnore
    public boolean isDict() {
        return dictType != null && !ObjectUtils.isEmpty(dictType.trim());
    }

    @JsonIgnore
    public boolean isInput() {
        return CodeGenConstants.HTML_INPUT.equals(htmlType);
    }

    @JsonIgnore
    public boolean isSelect() {
        return CodeGenConstants.HTML_SELECT.equals(htmlType);
    }

    @JsonIgnore
    public boolean isRadio() {
        return CodeGenConstants.HTML_RADIO.equals(htmlType);
    }

    @JsonIgnore
    public Object getDefaultRadio() {
        if ("Integer".equals(javaType) || "Long".equals(javaField)) {
            return 0;
        } else {
            return "0";
        }
    }

    @JsonIgnore
    public boolean isDatetime() {
        return CodeGenConstants.HTML_DATETIME.equals(htmlType);
    }

    @JsonIgnore
    public boolean isBetween() {
        return "BETWEEN".equals(htmlType);
    }

    @JsonIgnore
    public boolean isCheckbox() {
        return CodeGenConstants.HTML_CHECKBOX.equals(htmlType);
    }

    @JsonIgnore
    public String comment() {
        int en = columnComment.indexOf('(');
        int cn = columnComment.indexOf('（');
        int index = Math.max(en, cn);
        if (index != -1) {
            return columnComment.substring(0, index);
        }
        return columnComment;
    }

    @JsonIgnore
    public String getAttrName() {
        return javaField.substring(0, 1).toUpperCase() + javaField.substring(1);
    }

    @JsonIgnore
    public Boolean fromValue() {
        return !isDatetime() && !isBetween() && !"createBy".equals(javaField) && !"updateBy".equals(javaField);
    }

    @JsonIgnore
    public Boolean listAndDict() {
        return list() && isDict();
    }


}
