package cn.fateverse.code.aspect;

import cn.fateverse.code.entity.CodeDataSource;
import cn.fateverse.code.factory.DynamicDataSourceService;
import cn.fateverse.code.mapper.DataSourceMapper;
import cn.fateverse.code.mapper.dynamic.DynamicTableMapper;
import cn.fateverse.common.core.exception.CustomException;
import lombok.SneakyThrows;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;

/**
 * 动态数据源反射控制
 *
 * @author Clay
 * @date 2022/11/17
 */
@Aspect
@Component
public class DynamicTableAspect {

    private final DataSourceMapper dataSourceMapper;

    private final DynamicDataSourceService dynamicDataSourceService;


    public DynamicTableAspect(DataSourceMapper dataSourceMapper,
                              DynamicDataSourceService dynamicDataSourceService) {
        this.dataSourceMapper = dataSourceMapper;
        this.dynamicDataSourceService = dynamicDataSourceService;
    }

    @SneakyThrows
    @Around("execution(* cn.fateverse.code.service.DynamicTableMetadataService.*(..))")
    public Object around(ProceedingJoinPoint point) {
        Object[] args = point.getArgs();
        Long dataSourceId = (Long) args[args.length - 1];
        //获取到当前数据源id的数据源
        CodeDataSource codeDataSource = dataSourceMapper.selectById(dataSourceId);
        if (null == codeDataSource) {
            throw new CustomException("数据源错误!");
        }
        //获取动态数据源的sqlSession
        DynamicTableMapper dynamicTableMapper = dynamicDataSourceService.getMapper(codeDataSource);
        //获取到当前代理的对象
        Object target = point.getTarget();
        Class<?> targetClass = target.getClass();
        //将数据源对象通过反射设置到代理对象中
        Field dataSource = targetClass.getDeclaredField("dataSource");
        dataSource.setAccessible(true);
        dataSource.set(target, codeDataSource);
        //获取到获取到数据源mapper字段对象
        Field dataSourceMapperField = targetClass.getDeclaredField("dynamicTableMapper");
        dataSourceMapperField.setAccessible(true);
        //将动态表格的mapper通过反射的方式设置到代理对象中
        dataSourceMapperField.set(target, dynamicTableMapper);
        //运行代理的函数
        Object proceed;
        try {
            proceed = point.proceed();
        } catch (Exception e) {
            dynamicDataSourceService.remove(dataSourceId);
            throw e;
        }
        //将表格mapper对象置null
        dataSourceMapperField.set(target, null);
        //对数据源对象置null
        dataSource.set(target, null);
        //关闭sqlSession
        dynamicDataSourceService.closeSqlSession();
        //返回对象
        return proceed;
    }

}
