package cn.fateverse.common.mybatis.interceptor;

import cn.fateverse.common.mybatis.annotaion.DynamicField;
import cn.fateverse.common.mybatis.annotaion.DynamicTable;
import cn.fateverse.common.mybatis.entity.DynamicWrapper;
import cn.fateverse.common.mybatis.handler.DynamicException;
import cn.hutool.core.collection.ConcurrentHashSet;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.cache.CacheKey;
import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Signature;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;
import org.springframework.util.ObjectUtils;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;


@Slf4j
@Intercepts(value = {
        @Signature(type = Executor.class, method = "query", args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class}),
        @Signature(type = Executor.class, method = "query", args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class, CacheKey.class, BoundSql.class}),
        @Signature(type = Executor.class, method = "update", args = {MappedStatement.class, Object.class})
})
public class DynamicTableInterceptor implements Interceptor {

    private final Map<String, DynamicWrapper> dynamicTableMap = new ConcurrentHashMap<>(8);

    private final Set<String> ignoreStatementSet = new ConcurrentHashSet<>();

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        //获取当前的查询参数
        Object[] args = invocation.getArgs();
        // 获取MappedStatement对象
        MappedStatement mappedStatement = (MappedStatement) args[0];
        //获取到当前mybatis的id,mybatis中不允许重载方法存在
        String mappedStatementId = mappedStatement.getId();
        if (ignoreStatementSet.contains(mappedStatementId)) {
            return invocation.proceed();
        }
        DynamicWrapper dynamicWrapper = dynamicTableMap.get(mappedStatementId);
        if (null == dynamicWrapper) {
            synchronized (dynamicTableMap) {
                dynamicWrapper = dynamicTableMap.get(mappedStatementId);
                if (null == dynamicWrapper) {
                    //获取到当前的class信息
                    String className = mappedStatementId.substring(0, mappedStatementId.lastIndexOf("."));
                    //获取到方法名称
                    String methodName = mappedStatementId.substring(mappedStatementId.lastIndexOf(".") + 1);
                    //获取到mapper类对象
                    Class<?> mapperClass = this.getClass().getClassLoader().loadClass(className);
                    //获取到类对象上注解信息
                    DynamicTable classAnnotation = mapperClass.getAnnotation(DynamicTable.class);
                    //类上并没有表述当前注解,认为不需要SaaS处理,直接方法,后续添加到忽略的set对象中,并执行程序
                    if (classAnnotation == null) {
                        ignoreStatementSet.add(mappedStatementId);
                        return invocation.proceed();
                    }
                    //是否映射对象
                    if (!(args[1] instanceof HashMap)) {
                        ignoreStatementSet.add(mappedStatementId);
                        return invocation.proceed();
                    }
                    //获取到表格名称
                    String tableName = classAnnotation.value();
                    if (ObjectUtils.isEmpty(tableName)) {
                        throw new DynamicException("DynamicTable注解必须指定明确的表名称!");
                    }
                    //获取到其中的所有方法信息
                    Method[] declaredMethods = mapperClass.getDeclaredMethods();
                    //解析到当前执行的方法
                    Method method = null;
                    for (Method declaredMethod : declaredMethods) {
                        if (methodName.startsWith(declaredMethod.getName())) {
                            method = declaredMethod;
                        }
                    }
                    //方法上是否存在类注解信息,优先级为先使用方法上的
                    assert method != null;
                    DynamicTable methodAnnotation = method.getAnnotation(DynamicTable.class);
                    if (methodAnnotation != null && !ObjectUtils.isEmpty(methodAnnotation.value())) {
                        tableName = methodAnnotation.value();
                    }
                    //获取到方法上的参数信息
                    Parameter[] methodParameters = method.getParameters();
                    //初始化包装类
                    dynamicWrapper = new DynamicWrapper();
                    dynamicWrapper.setTableName(tableName);
                    int count = 0;
                    for (int i = 0; i < methodParameters.length; i++) {
                        Parameter methodParameter = methodParameters[i];
                        DynamicField dynamicField = methodParameter.getAnnotation(DynamicField.class);
                        //获取当前参数上是否存在注解,如果存在,则表示当前为SaaS的动态参数
                        if (dynamicField != null) {
                            String fieldName = dynamicField.value();
                            if (ObjectUtils.isEmpty(fieldName)) {
                                throw new DynamicException("DynamicField注解必须指定明确的字段名称!");
                            }
                            String keyName = "param" + (i + 1);
                            Param param = methodParameter.getAnnotation(Param.class);
                            if (null != param && !ObjectUtils.isEmpty(param.value())) {
                                fieldName = param.value();
                                keyName = fieldName;
                            }
                            count++;
                            dynamicWrapper.setKeyName(keyName);
                            dynamicWrapper.setFieldName(fieldName);
                        }
                    }
                    if (count != 1) {
                        throw new DynamicException("配置的动态参数为 : " + count + ",不合法,应该只存在1个动态参数");
                    }
                    dynamicTableMap.put(mappedStatementId, dynamicWrapper);
                }
            }
        }
        HashMap<String, Object> parametersMap = (HashMap<String,Object>) args[1];
        parametersMap.put(dynamicWrapper.getFieldName(), dynamicWrapper.getTableName() + "_" + parametersMap.get(dynamicWrapper.getKeyName()));
        return invocation.proceed();
    }

}
