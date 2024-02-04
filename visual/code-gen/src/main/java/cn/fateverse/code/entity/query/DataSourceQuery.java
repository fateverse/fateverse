package cn.fateverse.code.entity.query;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


/**
 * @author Clay
 * @Date: 2023/5/18
 */
@Data
public class DataSourceQuery {
    /**
     * 数据源名称
     */
    @ApiModelProperty("数据源名称")
    private String dsName;

}
