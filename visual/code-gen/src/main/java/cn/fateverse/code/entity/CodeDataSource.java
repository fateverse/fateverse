package cn.fateverse.code.entity;

import cn.fateverse.code.enums.DynamicSourceEnum;
import cn.fateverse.common.core.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * @author Clay
 * @date 2022/11/16
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CodeDataSource extends BaseEntity {

    /**
     * 数据源id
     */
    private Long dsId;
    /**
     * 数据源名称
     */
    private String dsName;
    /**
     * 数据源用户名
     */
    private String username;
    /**
     * 数据源密码
     */
    private String password;
    /**
     * 数据源主机
     */
    private String host;
    /**
     * 数据源主机端口
     */
    private Integer port;
    /**
     * 数据源类型
     */
    private DynamicSourceEnum type;
    /**
     * 数据库名称
     */
    private String dbName;
    /**
     * 数据库连接地址
     */
    private String jdbcUrl;
    /**
     * 数据源类型 (1:主机 2:jdbc连接url)
     */
    private Integer confType;
    /**
     * 连接参数
     */
    private String args;

    /**
     * 查询参数
     */
    private String params;


}
