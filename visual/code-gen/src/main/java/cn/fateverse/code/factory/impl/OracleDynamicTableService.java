package cn.fateverse.code.factory.impl;

import cn.fateverse.code.entity.CodeDataSource;
import cn.fateverse.code.entity.TableColumn;
import cn.fateverse.code.mapper.dynamic.DynamicTableMapper;
import cn.fateverse.code.mapper.dynamic.OracleDynamicTableMapper;
import cn.fateverse.code.util.constant.CodeGenConstants;
import cn.fateverse.common.core.utils.ObjectUtils;
import com.alibaba.fastjson2.JSONObject;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

/**
 * @author Clay
 * @date 2023-07-30
 */
public class OracleDynamicTableService extends AbstractDynamicTableService {

    /**
     * oracle字符类型
     */
    public static final String[] ORACLE_COLUMN_TYPE_STR = {"VARCHAR", "VARCHAR2", "NVARCHAR2", "CLOB"};

    /**
     * oracle 数字类型
     */
    public static final String[] ORACLE_COLUMN_TYPE_NUMBER = {"NUMBER"};

    /**
     * oracle 时间类型
     */
    public static final String[] ORACLE_COLUMN_TYPE_DATE = {"DATE"};

    /**
     * oracle 大文本类型
     */
    public static final String ORACLE_CLOB = "CLOB";

    /**
     * oracle 大文本二进制类型
     */
    public static final String ORACLE_BLOB = "BLOB";

    @Override
    public SqlSessionFactory getSqlSessionFactory(CodeDataSource dataSource) {
        return super.getSqlSessionFactory(dataSource, "classpath:mapper/dynamic/OracleDynamicTableMapper.xml");
    }

    @Override
    public DynamicTableMapper getTableMapper(SqlSession sqlSession) {
        return sqlSession.getMapper(OracleDynamicTableMapper.class);
    }

    @Override
    public String getDataBaseUrl(CodeDataSource dataSource) {
        JSONObject params = super.checkParam(dataSource.getParams(), "服务名称不能为空", "serviceName");
        return "jdbc:oracle:thin:@" + dataSource.getHost() + ":" + dataSource.getPort() + ":" + params.getString("serviceName") + (ObjectUtils.isEmpty(dataSource.getArgs()) ? "" : dataSource.getArgs());
    }

    @Override
    void initColumn(TableColumn column) {
        column.setIsIncrement(CodeGenConstants.NO_REQUIRE);
        if (arraysContains(ORACLE_COLUMN_TYPE_STR, column.getColumnType())) {
            Integer columnLength = column.getColumnLength();
            String htmlType = columnLength >= 500 || ORACLE_CLOB.equals(column.getColumnComment()) ? CodeGenConstants.HTML_TEXTAREA : CodeGenConstants.HTML_INPUT;
            column.setHtmlType(htmlType);
        } else if (arraysContains(ORACLE_COLUMN_TYPE_DATE, column.getColumnType())) {
            column.setJavaType(CodeGenConstants.TYPE_DATE);
            column.setHtmlType(CodeGenConstants.HTML_DATETIME);
        } else if (arraysContains(ORACLE_COLUMN_TYPE_NUMBER, column.getColumnType())) {
            column.setHtmlType(CodeGenConstants.HTML_INPUT);
            // 如果是浮点型 统一用BigDecimal
            if (null != column.getColumnScale() && column.getColumnScale() > 0) {
                column.setJavaType(CodeGenConstants.TYPE_BIG_DECIMAL);
            } else if (column.getColumnLength() <= 10) {
                // 如果是整形
                column.setJavaType(CodeGenConstants.TYPE_INTEGER);
            } else {
                // 长整形
                column.setJavaType(CodeGenConstants.TYPE_LONG);
            }
        }
    }

    @Override
    public String getMapperTemplate() {
        return "vm/xml/mapperOracle.xml.vm";
    }
}
