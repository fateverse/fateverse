package cn.fateverse.code.factory;

import cn.fateverse.code.entity.CodeDataSource;
import cn.fateverse.code.enums.DynamicSourceEnum;
import cn.fateverse.code.mapper.dynamic.DynamicTableMapper;
import cn.fateverse.common.core.exception.CustomException;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 动态数据源获取类
 *
 * @author Clay
 * @date 2023-07-16
 */
@Component
public class DynamicDataSourceService {

    private final Map<Long, SqlSessionFactory> factoryMap = new ConcurrentHashMap<>(8);

    private static final ThreadLocal<SqlSession> session = new ThreadLocal<>();


    /**
     * 获取到数据源的
     *
     * @param dataSource 数据源
     * @return 返回sqlSession
     */
    public DynamicTableMapper getMapper(CodeDataSource dataSource) {
        SqlSessionFactory sqlSessionFactory = factoryMap.get(dataSource.getDsId());
        DynamicSourceEnum type = dataSource.getType();
        if (sqlSessionFactory == null) {
            synchronized (this) {
                sqlSessionFactory = factoryMap.get(dataSource.getDsId());
                if (null == sqlSessionFactory) {
                    sqlSessionFactory = type.getDynamicDataSourceFactory().getSqlSessionFactory(dataSource);
                    factoryMap.put(dataSource.getDsId(), sqlSessionFactory);
                }
            }
        }
        SqlSession sqlSession = sqlSessionFactory.openSession();
        session.set(sqlSession);
        return type.getDynamicDataSourceFactory().getTableMapper(sqlSession);
    }

    /**
     * 检查当前数据源是否可连接
     *
     * @param dataSource 数据源
     * @return 状态
     */
    public Boolean checkDataSource(CodeDataSource dataSource) {
        try {
            SqlSessionFactory sqlSessionFactory = dataSource.getType().getDynamicDataSourceFactory().getSqlSessionFactory(dataSource);
            SqlSession sqlSession = sqlSessionFactory.openSession();
            DynamicTableMapper tableMapper = dataSource.getType().getDynamicDataSourceFactory().getTableMapper(sqlSession);
            tableMapper.checkSource();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            if (e instanceof CustomException) {
                throw e;
            }
            return Boolean.FALSE;
        }
    }

    /**
     * 删除当前的缓存
     *
     * @param dataSourceId 数据源id
     */
    public synchronized void remove(Long dataSourceId) {
        factoryMap.remove(dataSourceId);
    }

    /**
     * 关闭sqlSession
     */
    public void closeSqlSession() {
        session.get().close();
        session.remove();
    }
}
