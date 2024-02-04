package cn.fateverse.code.entity.dto;

import cn.fateverse.code.entity.CodeDataSource;
import cn.fateverse.code.enums.DynamicSourceEnum;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;


/**
 * @author Clay
 * @Date: 2023/5/18
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("数据源新增")
public class DataSourceDto {

    /**
     * 数据源id
     */
    @ApiModelProperty("数据源id")
    private Long dsId;

    /**
     * 数据源名称
     */
    @ApiModelProperty("数据源名称")
    @NotBlank(message = "数据源名称不能为空")
    private String dsName;

    /**
     * 数据源用户名
     */
    @ApiModelProperty("数据源用户名")
    @NotBlank(message = "数据源用户名")
    private String username;

    /**
     * 数据源密码
     */
    @ApiModelProperty("数据源密码")
    private String password;

    /**
     * 数据源主机
     */
    @ApiModelProperty("数据源主机")
    private String host;

    /**
     * 数据源主机端口
     */
    @ApiModelProperty("数据源主机端口")
    private Integer port;

    /**
     * 数据源类型
     */
    @ApiModelProperty("数据源类型")
    @NotNull(message = "数据源类型不能为空")
    private DynamicSourceEnum type;

    /**
     * 数据库名称
     */
    @ApiModelProperty("数据库名称")
    private String dbName;

    /**
     * 数据库连接地址
     */
    @ApiModelProperty("数据库连接地址")
    private String jdbcUrl;

    /**
     * 数据源类型 (1:主机 2:jdbc连接url)
     */
    @ApiModelProperty("数据源类型 (1:主机 2:jdbc连接url)")
    @Max(value = 2, message = "参数不合法")
    @Min(value = 1, message = "参数不合法")
    private Integer confType;

    /**
     * 连接参数
     */
    private String args;

    /**
     * 查询参数
     */
    private String params;


    public CodeDataSource toCodeDataSource() {
        if (confType.equals(1)) {
            return CodeDataSource.builder()
                    .dsId(dsId)
                    .dsName(dsName)
                    .username(username)
                    .password(password)
                    .host(host)
                    .port(port)
                    .type(type)
                    .args(args)
                    .params(params)
                    .dbName(dbName)
                    .confType(confType)
                    .build();
        } else {
            return CodeDataSource.builder()
                    .dsId(dsId)
                    .dsName(dsName)
                    .username(username)
                    .password(password)
                    .jdbcUrl(jdbcUrl)
                    .confType(confType)
                    .params(params)
                    .build();
        }
    }

}
