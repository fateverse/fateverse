package cn.fateverse.code.factory;

import cn.fateverse.code.entity.CodeDataSource;
import cn.fateverse.code.entity.DynamicPage;
import cn.fateverse.code.entity.Table;
import cn.fateverse.code.entity.TableColumn;
import cn.fateverse.code.entity.dto.TableDto;
import cn.fateverse.code.mapper.dynamic.DynamicTableMapper;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import java.util.List;
import java.util.Map;

/**
 * 动态表格服务接口
 *
 * @author Clay
 * @date 2023-07-16
 */
public interface DynamicTableService {

    /**
     * 获取到数据库session 工厂
     *
     * @param dataSource 数据源管理信息
     * @return 数据工厂
     */
    SqlSessionFactory getSqlSessionFactory(CodeDataSource dataSource);

    /**
     * 获取到查询的mapper映射文件
     *
     * @param sqlSession sqlSession
     * @return 映射的mapper
     */
    DynamicTableMapper getTableMapper(SqlSession sqlSession);

    /**
     * 获取到动态的分页信息
     *
     * @return 分页信息
     */
    DynamicPage getDynamicPage();

    /**
     * 使用数据源拼接jdbcUrl
     *
     * @param dataSource 数据源管理信息
     * @return url返回参数
     */
    String getDataBaseUrl(CodeDataSource dataSource);

    /**
     * 获取到数据库对应的特殊参数
     *
     * @param dataSource 数据库特殊参数
     * @return 返回参数
     */
    Map<String, Object> getParams(CodeDataSource dataSource);

    /**
     * 初始化表格信息
     *
     * @param table        表格
     * @param tableColumns 表格列表
     */
    TableDto initTable(Table table, List<TableColumn> tableColumns);

    /**
     * 获取到mapper映射
     *
     * @return mapper映射文件
     */
    String getMapperTemplate();
}
