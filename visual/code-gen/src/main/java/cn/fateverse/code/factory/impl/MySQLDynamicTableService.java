package cn.fateverse.code.factory.impl;

import cn.fateverse.code.entity.CodeDataSource;
import cn.fateverse.code.entity.TableColumn;
import cn.fateverse.code.mapper.dynamic.DynamicTableMapper;
import cn.fateverse.code.mapper.dynamic.MySqlDynamicTableMapper;
import cn.fateverse.code.util.constant.CodeGenConstants;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;


/**
 * @author Clay
 * @date 2023-07-29
 */
public class MySQLDynamicTableService extends AbstractDynamicTableService {


    /**
     * mysql 数据库字符串类型
     */
    public static final String[] MYSQL_COLUMN_TYPE_STR = {"char", "varchar", "nvarchar", "nvarchar2", "varchar2", "tinytext", "text",
            "mediumtext", "longtext"};

    /**
     * mysql 数据库文本类型
     */
    public static final String[] MYSQL_COLUMN_TYPE_TEXT = {"tinytext", "text", "mediumtext", "longtext"};

    /**
     * mysql 数据库时间类型
     */
    public static final String[] MYSQL_COLUMN_TYPE_TIME = {"datetime", "time", "date", "timestamp"};

    /**
     * mysql 数据库数字类型
     */
    public static final String[] MYSQL_COLUMN_TYPE_NUMBER = {"tinyint", "smallint", "mediumint", "int", "number", "integer",
            "bit", "bigint"};

    /**
     * mysql 数据库浮点类型
     */
    public static final String[] MYSQL_COLUMN_TYPE_FLOAT = {"float", "float", "double", "decimal"};


    @Override
    public SqlSessionFactory getSqlSessionFactory(CodeDataSource dataSource) {
        return super.getSqlSessionFactory(dataSource,"classpath:mapper/dynamic/MySqlDynamicTableMapper.xml");
    }

    @Override
    public DynamicTableMapper getTableMapper(SqlSession sqlSession) {
        return sqlSession.getMapper(MySqlDynamicTableMapper.class);
    }

    @Override
    public String getDataBaseUrl(CodeDataSource dataSource) {
        return "jdbc:mysql://" + dataSource.getHost() + ":" + dataSource.getPort() + "/" + dataSource.getDbName() + dataSource.getArgs();
    }


    @Override
    void initColumn(TableColumn column) {
        column.setColumnType(column.getColumnType().toLowerCase());
        String dataType = getDbType(column.getColumnType());
        column.setColumnLength(getColumnLength(column.getColumnType()));
        if (arraysContains(MYSQL_COLUMN_TYPE_STR, dataType) || arraysContains(MYSQL_COLUMN_TYPE_TEXT, dataType)) {
            // 字符串长度超过500设置为文本域
            Integer columnLength = column.getColumnLength();
            String htmlType = columnLength >= 500 || arraysContains(MYSQL_COLUMN_TYPE_TEXT, dataType) ? CodeGenConstants.HTML_TEXTAREA : CodeGenConstants.HTML_INPUT;
            column.setHtmlType(htmlType);
        } else if (arraysContains(MYSQL_COLUMN_TYPE_TIME, dataType)) {
            column.setJavaType(CodeGenConstants.TYPE_DATE);
            column.setHtmlType(CodeGenConstants.HTML_DATETIME);
        } else if (arraysContains(MYSQL_COLUMN_TYPE_NUMBER, dataType)) {
            column.setHtmlType(CodeGenConstants.HTML_INPUT);
            // 如果是浮点型 统一用BigDecimal
            String[] str = StringUtils.split(StringUtils.substringBetween(column.getColumnType(), "(", ")"), ",");
            if (str != null && str.length == 2 && Integer.parseInt(str[1]) > 0) {
                column.setJavaType(CodeGenConstants.TYPE_BIG_DECIMAL);
            } else if (str != null && str.length == 1 && Integer.parseInt(str[0]) <= 10) {
                // 如果是整形
                column.setJavaType(CodeGenConstants.TYPE_INTEGER);
            } else {
                // 长整形
                column.setJavaType(CodeGenConstants.TYPE_LONG);
            }
            // 如果类型确定是浮点型,直接使用BigDecimal
        } else if (arraysContains(MYSQL_COLUMN_TYPE_FLOAT, dataType)) {
            column.setHtmlType(CodeGenConstants.HTML_INPUT);
            column.setJavaType(CodeGenConstants.TYPE_BIG_DECIMAL);
        }
    }

    @Override
    public String getMapperTemplate() {
        return "vm/xml/mapperMySql.xml.vm";
    }
}
