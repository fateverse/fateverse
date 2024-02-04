package cn.fateverse.code.enums;

import cn.fateverse.code.factory.DynamicTableService;
import cn.fateverse.code.factory.impl.MySQLDynamicTableService;
import cn.fateverse.code.factory.impl.OracleDynamicTableService;

/**
 * @author Clay
 * @date 2023-07-29
 */
public enum DynamicSourceEnum {

    /**
     * 数据库状态
     */
    MYSQL("mysql", "com.mysql.cj.jdbc.Driver", MySQLDynamicTableService.class),
    MARIADB("mariadb", "org.mariadb.jdbc.Driver", MySQLDynamicTableService.class),
    ORACLE("oracle", "oracle.jdbc.driver.OracleDriver", OracleDynamicTableService.class),
    POSTGRES("postgres", "org.postgresql.Driver", DynamicTableService.class),
    ;


    private final String type;

    private final String drive;

    private final Class<? extends DynamicTableService> clazz;

    private volatile DynamicTableService dynamicTableService;


    DynamicSourceEnum(String type, String drive, Class<? extends DynamicTableService> clazz) {
        this.type = type;
        this.drive = drive;
        this.clazz = clazz;
    }

    public String getType() {
        return type;
    }

    public String getDrive() {
        return drive;
    }

    public DynamicTableService getDynamicDataSourceFactory() {
        if (null == dynamicTableService) {
            synchronized (this) {
                if (null == dynamicTableService) {
                    try {
                        dynamicTableService = clazz.newInstance();
                    } catch (InstantiationException | IllegalAccessException e) {
                        e.printStackTrace();
                        throw new RuntimeException("初始化实例失败!");
                    }
                }
            }
        }
        return dynamicTableService;
    }


}
