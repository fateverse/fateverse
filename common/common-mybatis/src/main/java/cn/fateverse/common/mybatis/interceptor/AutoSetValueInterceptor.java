package cn.fateverse.common.mybatis.interceptor;

import cn.fateverse.common.core.annotaion.EnableAutoField;
import cn.hutool.core.convert.Convert;
import cn.hutool.core.util.IdUtil;
import cn.fateverse.common.core.utils.AutoSetValueUtils;
import cn.fateverse.common.core.entity.BaseEntity;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.utils.uuid.IdUtils;
import cn.fateverse.common.core.annotaion.AutoTime;
import cn.fateverse.common.core.annotaion.AutoUser;
import cn.fateverse.common.core.annotaion.GenerateId;
import cn.fateverse.common.core.enums.MethodEnum;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.binding.MapperMethod;
import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.SqlCommandType;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Signature;

import java.lang.reflect.Field;
import java.util.*;

/**
 * @author Clay
 * @date 2022/11/19
 */
@Slf4j
@Intercepts(@Signature(type = Executor.class, method = "update", args = {MappedStatement.class, Object.class}))
public class AutoSetValueInterceptor implements Interceptor {

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        Object[] args = invocation.getArgs();
        MappedStatement mappedStatement = (MappedStatement) args[0];
        //获取到本次sql执行类型
        SqlCommandType sqlCommandType = mappedStatement.getSqlCommandType();
        //获取到当前方法的类型
        MethodEnum methodEnum = null;
        if (SqlCommandType.INSERT == sqlCommandType) {
            methodEnum = MethodEnum.INSERT;
        } else if (SqlCommandType.UPDATE == sqlCommandType) {
            methodEnum = MethodEnum.UPDATE;
        } else {
            return invocation.proceed();
        }
        Object arg = args[1];
        //是否映射对象
        if (arg instanceof MapperMethod.ParamMap) {
            MapperMethod.ParamMap parametersMap = (MapperMethod.ParamMap) arg;
            Set<Object> paramSet = new HashSet<>();
            Set keySet = parametersMap.keySet();
            for (Object key : keySet) {
                Object param = parametersMap.get(key);
                paramSet.add(param);
            }
            for (Object param : paramSet) {
                autoSetValue(param, methodEnum);
            }
        } else {
            autoSetValue(arg, methodEnum);
        }
        return invocation.proceed();
    }

    private void autoSetValue(Object param, MethodEnum methodEnum) {
        Class<?> target = param.getClass();
        if (param instanceof AbstractList) {
            AbstractList<Object> list = (AbstractList<Object>) param;
            if (list == null && list.isEmpty()) {
                return;
            }
            target = list.get(0).getClass();
        }
        EnableAutoField enable = target.getAnnotation(EnableAutoField.class);
        if (null == enable) {
            return;
        }
        Set<Field> generateIdSet = new HashSet<>();
        Set<Field> autoUserSet = new HashSet<>();
        Set<Field> autoTimeSet = new HashSet<>();
        if (param instanceof AbstractList) {
            AbstractList<Object> list = (AbstractList<Object>) param;
            checkAnnotation(list.get(0), generateIdSet, autoUserSet, autoTimeSet, methodEnum);
            for (Object data : list) {
                generateId(data, generateIdSet);
            }
            AutoSetValueUtils.autoUserList(list, methodEnum, autoUserSet);
            AutoSetValueUtils.autoTimeList(list, methodEnum, autoTimeSet);
        } else {
            checkAnnotation(param, generateIdSet, autoUserSet, autoTimeSet, methodEnum);
            generateId(param, generateIdSet);
            AutoSetValueUtils.autoUserNew(param, methodEnum, autoTimeSet);
            AutoSetValueUtils.autoTimeNew(param, methodEnum, autoTimeSet);
        }
    }


    private void checkAnnotation(Object data, Set<Field> generateIdSet, Set<Field> autoUserSet, Set<Field> autoTimeSet, MethodEnum methodEnum) {
        //获取到所有的字
        Class<?> targetClass = data.getClass();
        List<Field> fields = new ArrayList<>(Arrays.asList(targetClass.getDeclaredFields()));
        if (data instanceof BaseEntity) {
            Class<?> superclass = targetClass.getSuperclass();
            List<Field> superField = Arrays.asList(superclass.getDeclaredFields());
            fields.addAll(superField);
        }
        for (Field field : fields) {
            GenerateId generateId = field.getAnnotation(GenerateId.class);
            if (null != generateId && methodEnum == MethodEnum.INSERT) {
                generateIdSet.add(field);
            }
            AutoUser autoUser = field.getAnnotation(AutoUser.class);
            if (autoUser != null) {
                autoUserSet.add(field);
            }
            AutoTime autoTime = field.getAnnotation(AutoTime.class);
            if (autoTime != null) {
                autoTimeSet.add(field);
            }
        }
    }


    /**
     * 自动生成id
     *
     * @param parameter 参数
     * @param fields    字段
     */
    private void generateId(Object parameter, Set<Field> fields) {
        for (Field field : fields) {
            GenerateId generateId = field.getAnnotation(GenerateId.class);
            try {
                Class<?> type = field.getType();
                switch (generateId.idType()) {
                    case UUID:
                        Object uuid = Convert.convert(type, IdUtils.randomUUID());
                        field.setAccessible(true);
                        field.set(parameter, uuid);
                        break;
                    case SNOWFLAKE:
                        Object snoId = Convert.convert(type, IdUtil.getSnowflake(1).nextId());
                        field.setAccessible(true);
                        field.set(parameter, snoId);
                        break;
                    default:
                        throw new ClassCastException("GenerateId未指定数据类型或者数据类型不存在");
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace();
                throw new CustomException("Id自动生成失败");
            }
        }
    }

}
