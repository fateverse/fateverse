package cn.fateverse.code.entity.vo;

import cn.fateverse.code.entity.CodeDataSource;
import cn.fateverse.common.core.annotaion.Excel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.io.Serializable;
import java.util.Date;

/**
 * @author Clay
 * @Date: 2023/5/18
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("数据源返回实体")
public class DataSourceVo implements Serializable {

    /**
     * 数据源id
     */
    @ApiModelProperty("数据源id")
    private Long dsId;

    /**
     * 数据源名称
     */
    @ApiModelProperty("数据源名称")
    @Excel("数据源名称")
    private String dsName;

    /**
     * 数据源用户名
     */
    @ApiModelProperty("数据源用户名")
    @Excel("数据源用户名")
    private String username;

    /**
     * 数据源密码
     */
    @ApiModelProperty("数据源密码")
    @Excel("数据源密码")
    private String password;

    /**
     * 数据源主机
     */
    @ApiModelProperty("数据源主机")
    @Excel("数据源主机")
    private String host;

    /**
     * 数据源主机端口
     */
    @ApiModelProperty("数据源主机端口")
    @Excel("数据源主机端口")
    private Integer port;

    /**
     * 数据源类型
     */
    @ApiModelProperty("数据源类型")
    @Excel("数据源类型")
    private String dsType;

    /**
     * 数据库名称
     */
    @ApiModelProperty("数据库名称")
    @Excel("数据库名称")
    private String dbName;

    /**
     * 数据库连接地址
     */
    @ApiModelProperty("数据库连接地址")
    @Excel("数据库连接地址")
    private String jdbcUrl;
    /**
     * 数据源类型 (1:主机 2:jdbc连接url)
     */
    @ApiModelProperty("数据源类型 (1:主机 2:jdbc连接url)")
    @Max(value = 2, message = "参数不合法")
    @Min(value = 1, message = "参数不合法")
    @Excel("数据源类型")
    private Integer confType;

    /**
     * 连接参数
     */
    private String args;

    /**
     * 查询参数
     */
    private String params;

    private Date createTime;

    public static DataSourceVo toDataSourceVo(CodeDataSource data) {
        return DataSourceVo.builder()
                .dsId(data.getDsId())
                .dsName(data.getDsName())
                .dbName(data.getDbName())
                .username(data.getUsername())
                .port(data.getPort())
                .jdbcUrl(data.getJdbcUrl())
                .confType(data.getConfType())
                .args(data.getArgs())
                .params(data.getParams())
                .build();
    }
}
