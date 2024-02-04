package cn.fateverse.common.mybatis;

import cn.fateverse.common.mybatis.interceptor.AutoSetValueInterceptor;
import cn.fateverse.common.mybatis.interceptor.DynamicTableInterceptor;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;

import javax.annotation.PostConstruct;
import java.util.List;

/**
 * @author Clay
 * @date 2022/11/19
 */
@MapperScan("${mybatis.mapperPackage}")
public class MybatisAutoConfiguration implements ApplicationRunner {

    /**
     * 按照表格数据隔离
     */
    @Value("${mybatis.tableSaas}")
    private Boolean tableSaas = false;

    private final List<SqlSessionFactory> sqlSessionFactoryList;

    private final DynamicTableInterceptor dynamicTableInterceptor = new DynamicTableInterceptor();

    private final AutoSetValueInterceptor autoSetValueInterceptor = new AutoSetValueInterceptor();

    public MybatisAutoConfiguration(List<SqlSessionFactory> sqlSessionFactoryList) {
        this.sqlSessionFactoryList = sqlSessionFactoryList;
    }

    @PostConstruct
    public void init() {
        //向sqlSession中添加拦截器
        for (SqlSessionFactory sqlSessionFactory : sqlSessionFactoryList) {
            sqlSessionFactory.getConfiguration().addInterceptor(autoSetValueInterceptor);
        }
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (tableSaas) {
            //向sqlSession中添加拦截器
            for (SqlSessionFactory sqlSessionFactory : sqlSessionFactoryList) {
                sqlSessionFactory.getConfiguration().addInterceptor(dynamicTableInterceptor);
            }
        }
    }
}
