package cn.fateverse.code.entity.bo;

import cn.fateverse.code.entity.dto.TableDto;
import cn.hutool.core.util.StrUtil;
import cn.fateverse.code.entity.TableColumn;
import cn.fateverse.code.util.constant.CodeGenConstants;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;


/**
 * 代码生成时专用增强dto
 *
 * @author Clay
 * @date 2022/11/18
 */
@Data
public class TableGenBo extends TableDto {
    private TableColumn pkColumn;


    /**
     * 是否启动正则
     */
    public boolean isRegular() {
        return this.getColumns().stream().anyMatch(column -> column.getIsRegular() != 0);
    }

    /**
     * 是否为空
     *
     * @return
     */
    public boolean isRequired() {
        return this.getColumns().stream().anyMatch(column -> "1".equals(column.getIsRequired()));
    }

    /**
     * 首字母大写转换
     *
     * @param str
     * @return
     */
    public String capitalize(String str) {
        return StringUtils.capitalize(str);
    }

    /**
     * 新增是拥有字段
     *
     * @return
     */
    public Boolean hasCreateXMLColumns() {
        boolean createByFlag = Boolean.FALSE;
        boolean createTimeFlag = Boolean.FALSE;
        for (TableColumn column : this.getColumns()) {
            if (CodeGenConstants.CREATE_BY_FIELD.equals(column.getJavaField())) {
                createByFlag = Boolean.TRUE;
            }
            if (CodeGenConstants.CREATE_TIME_FIELD.equals(column.getJavaField())) {
                createTimeFlag = Boolean.TRUE;
            }
        }
        return createByFlag && createTimeFlag;
    }

    /**
     * 更新是拥有字段
     *
     * @return
     */
    public Boolean hasUpdateXMLColumns() {
        boolean updateByFlag = Boolean.FALSE;
        boolean updateTimeFlag = Boolean.FALSE;
        for (TableColumn column : this.getColumns()) {
            if (CodeGenConstants.UPDATE_BY_FIELD.equals(column.getJavaField())) {
                updateByFlag = Boolean.TRUE;
            }
            if (CodeGenConstants.UPDATE_TIME_FIELD.equals(column.getJavaField())) {
                updateTimeFlag = Boolean.TRUE;
            }
        }
        return updateByFlag && updateTimeFlag;
    }

    /**
     * 筛选Dto中的时间格式
     *
     * @return
     */
    public Boolean hasDateDto() {
        return this.getColumns().stream().anyMatch(column ->
                (CodeGenConstants.REQUIRE.equals(column.getIsEdit()) || CodeGenConstants.REQUIRE.equals(column.getIsInsert())) && CodeGenConstants.TYPE_DATE.equals(column.getJavaType())
        );
    }

    public Boolean isEntityTime(String field) {
        if (CodeGenConstants.UPDATE_TIME_FIELD.equals(field) || CodeGenConstants.CREATE_TIME_FIELD.equals(field)) {
            return Boolean.TRUE;
        } else {
            return Boolean.FALSE;
        }
    }

    /**
     * 筛选Query中的时间格式
     *
     * @return
     */
    public Boolean hasDateQuery() {
        return this.getColumns().stream().anyMatch(column ->
                CodeGenConstants.REQUIRE.equals(column.getIsQuery()) && CodeGenConstants.TYPE_DATE.equals(column.getJavaType())
        );
    }

    /**
     * 筛选Vo中的时间格式
     *
     * @return
     */
    public Boolean hasDateVo() {
        return this.getColumns().stream().anyMatch(column ->
                CodeGenConstants.REQUIRE.equals(column.getIsList()) && CodeGenConstants.TYPE_DATE.equals(column.getJavaType())
        );
    }

    public Boolean hasListAndDict(){
        return this.getColumns().stream().anyMatch(column->(CodeGenConstants.HTML_SELECT.equals(column.getHtmlType()) || CodeGenConstants.HTML_RADIO.equals(column.getHtmlType()))
                && !StrUtil.isEmpty(column.getDictType()) && column.list());
    }


    public Boolean hasDictSelect() {
        return this.getColumns().stream().anyMatch(column ->
                (CodeGenConstants.HTML_SELECT.equals(column.getHtmlType()) || CodeGenConstants.HTML_RADIO.equals(column.getHtmlType()))
                        && !StrUtil.isEmpty(column.getDictType())
        );
    }

    public String getDictType(){
        StringBuilder cacheType = new StringBuilder();
        this.getColumns().stream().filter(column ->
                (CodeGenConstants.HTML_SELECT.equals(column.getHtmlType()) || CodeGenConstants.HTML_RADIO.equals(column.getHtmlType()))
                        && !StrUtil.isEmpty(column.getDictType()))
                .forEach(column ->cacheType.append(" '").append(column.getDictType()).append("',"));
        return cacheType.substring(0, cacheType.length() - 1);
    }



    public Boolean strNotEmpty(String str) {
        return !StrUtil.isEmpty(str);
    }

    public String getFieldList() {
        StringBuilder columnNames = new StringBuilder();
        this.getColumns().stream().filter(column -> "1".equals(column.getIsList())).forEach(column -> {
            columnNames.append(" \"").append(column.getColumnName()).append("\",");
        });
        return columnNames.substring(0, columnNames.length() - 1);
    }


    public Boolean hasOptionApi() {
        return getOptionInfo().getEnabled();
    }


    public String getOptionValueFiled() {
        String valueField = getOptionInfo().getValueField();
        return StringUtils.capitalize(valueField);
    }

    public String getOptionLabelFiled() {
        String labelFiled = getOptionInfo().getLabelFiled();
        return StringUtils.capitalize(labelFiled);
    }

}
