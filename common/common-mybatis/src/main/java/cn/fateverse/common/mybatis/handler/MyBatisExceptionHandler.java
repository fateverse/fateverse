package cn.fateverse.common.mybatis.handler;

import cn.fateverse.common.core.enums.ResultEnum;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.utils.ObjectUtils;
import org.apache.ibatis.exceptions.PersistenceException;
import org.mybatis.spring.MyBatisSystemException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class MyBatisExceptionHandler {


    @ExceptionHandler(MyBatisSystemException.class)
    public Result<String> handleMyBatisException(MyBatisSystemException e) {
        Throwable throwable = e.getCause();
        if (throwable instanceof PersistenceException){
            PersistenceException exception = (PersistenceException) throwable;
            Throwable cause = exception.getCause();
            if (cause instanceof DynamicException){
                DynamicException dynamicException = (DynamicException) cause;
                return ObjectUtils.isEmpty(dynamicException.getCode()) ? Result.error(dynamicException.getMessage()) : Result.error(dynamicException.getCode(), dynamicException.getMessage());
            };
        }
        return Result.error(ResultEnum.ERROR);
    }


}
