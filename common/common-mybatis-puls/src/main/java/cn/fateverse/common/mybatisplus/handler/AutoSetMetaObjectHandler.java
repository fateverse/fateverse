package cn.fateverse.common.mybatisplus.handler;

import cn.fateverse.common.core.annotaion.EnableAutoField;
import cn.fateverse.common.core.entity.BaseEntity;
import cn.fateverse.common.core.enums.MethodEnum;
import cn.fateverse.common.core.utils.AutoSetValueUtils;
import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


/**
 * @author Clay
 * @date 2023-05-25
 */
public class AutoSetMetaObjectHandler implements MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        autoSetValue(metaObject, MethodEnum.INSERT);
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        autoSetValue(metaObject, MethodEnum.UPDATE);
    }

    private void autoSetValue(MetaObject metaObject, MethodEnum method) {
        Object originalObject = metaObject.getOriginalObject();
        Class<?> target = originalObject.getClass();
        EnableAutoField enable = target.getAnnotation(EnableAutoField.class);
        if (null == enable){
            return;
        }
        //获取到所有的字
        List<Field> fields = new ArrayList<>(Arrays.asList(target.getDeclaredFields()));
        if (originalObject instanceof BaseEntity) {
            Class<?> superclass = target.getSuperclass();
            List<Field> superField = Arrays.asList(superclass.getDeclaredFields());
            fields.addAll(superField);
        }
        //循环处理
        for (Field field : fields) {
            AutoSetValueUtils.autoUser(originalObject, method, field);
            AutoSetValueUtils.autoTime(originalObject, method, field);
        }
    }

}
