package cn.fateverse.log.configuration;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.jdbc.metadata.DataSourcePoolMetadata;
import org.springframework.boot.jdbc.metadata.DataSourcePoolMetadataProvider;
import org.springframework.boot.jdbc.metadata.HikariDataSourcePoolMetadata;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


/**
 * @author Clay
 * @date 2023-05-25
 */
@Configuration
public class DataSourceHealthConfig {


    /**
     * 配置数据源池元数据提供者
     *
     * @return 数据源池元数据提供者
     */
    @Bean
    DataSourcePoolMetadataProvider dataSourcePoolMetadataProvider() {
        return dataSource -> dataSource instanceof HikariDataSource
                // 如果使用的数据源没有对应的 DataSourcePoolMetadata 实现的话也可以全部使用 NotAvailableDataSourcePoolMetadata
                ? new HikariDataSourcePoolMetadata((HikariDataSource) dataSource)
                : new NotAvailableDataSourcePoolMetadata();
    }


    /**
     * 不可用的数据源池元数据.
     */
    private static class NotAvailableDataSourcePoolMetadata implements DataSourcePoolMetadata {
        @Override
        public Float getUsage() {
            return null;
        }

        @Override
        public Integer getActive() {
            return null;
        }

        @Override
        public Integer getMax() {
            return null;
        }

        @Override
        public Integer getMin() {
            return null;
        }

        @Override
        public String getValidationQuery() {
            // 该字符串是适用于MySQL的简单查询语句,用于检查检查,其他数据库可能需要更换
            return "select 1";
        }

        @Override
        public Boolean getDefaultAutoCommit() {
            return null;
        }
    }
}
