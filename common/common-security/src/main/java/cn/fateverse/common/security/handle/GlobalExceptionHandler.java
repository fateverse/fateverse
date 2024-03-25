package cn.fateverse.common.security.handle;


import cn.fateverse.common.core.enums.ResultEnum;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.exception.UserPasswordNotMatchException;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.utils.ObjectUtils;
import com.alibaba.csp.sentinel.slots.block.authority.AuthorityException;
import com.alibaba.csp.sentinel.slots.block.degrade.DegradeException;
import com.alibaba.csp.sentinel.slots.block.flow.FlowException;
import com.alibaba.csp.sentinel.slots.block.flow.param.ParamFlowException;
import com.alibaba.csp.sentinel.slots.system.SystemBlockException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import javax.annotation.PostConstruct;
import java.lang.reflect.UndeclaredThrowableException;

/**
 * 全局异常处理器
 *
 * @author Clay
 * @date 2022/10/30
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    public GlobalExceptionHandler() {
        log.info("开始初始化全局异常处理器");
    }


    /**
     * 业务异常
     */
    @ExceptionHandler(CustomException.class)
    public Result<String> businessException(CustomException e) {
        if (ObjectUtils.isEmpty(e.getCode())) {
            return Result.error(e.getMessage());
        }
        return Result.error(e.getCode(), e.getMessage());
    }

    /**
     * 路径不存在
     *
     * @param e
     * @return
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    public Result<Object> handlerNoFoundException(NoHandlerFoundException e) {
        log.error(e.getMessage(), e);
        return Result.notFound( "路径不存在，请检查路径是否正确");
    }

    /**
     * 授权失败
     *
     * @param e
     * @return
     */
    @ExceptionHandler(AccessDeniedException.class)
    public Result<String> handleAuthorizationException(AccessDeniedException e) {
        log.error(e.getMessage());
        return Result.error(HttpStatus.FORBIDDEN, "没有权限，请联系管理员授权");
    }

    @ExceptionHandler(AccountExpiredException.class)
    public Result<String> handleAccountExpiredException(AccountExpiredException e) {
        log.error(e.getMessage(), e);
        return Result.error(e.getMessage());
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public Result<String> handleUsernameNotFoundException(UsernameNotFoundException e) {
        log.error(e.getMessage(), e);
        return Result.error(e.getMessage());
    }

    @ExceptionHandler(UserPasswordNotMatchException.class)
    public Result<String> handleUserPasswordNotMatchException(UserPasswordNotMatchException e) {
        log.error(e.getMessage(), e);
        return Result.error("用户名密码错误!");
    }


    /**
     * 自定义验证异常
     */
    @ExceptionHandler(BindException.class)
    public Result<String> validatedBindException(BindException e) {
        log.error(e.getMessage(), e);
        String message = e.getAllErrors().get(0).getDefaultMessage();
        return Result.error(message);
    }

    /**
     * 自定义验证异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<String> validExceptionHandler(MethodArgumentNotValidException e) {
        log.error(e.getMessage(), e);
        String message = e.getBindingResult().getFieldError().getDefaultMessage();
        return Result.error(message);
    }

    @ExceptionHandler(SignatureException.class)
    public Result<String> jwtExceptionHandler(JwtException e) {
        log.error(e.getMessage(), e);
        return Result.unauthorized("token解析失败,认证失败，无法访问系统资源");
    }

    @ExceptionHandler(RuntimeException.class)
    public Result<String> runtimeExceptionHandler(RuntimeException e) {
        log.error(e.getMessage(), e);
        if (e instanceof UndeclaredThrowableException) {
            return sentinelExceptionHandler(e);
        }
        return Result.error(e.getMessage());
    }


    @ExceptionHandler(Exception.class)
    public Result<String> handleException(Exception e) {
        log.error(e.getMessage(), e);
        return Result.error(ResultEnum.SYS_ERROR.msg);
    }

    private Result<String> sentinelExceptionHandler(RuntimeException undeclared) {
        Throwable throwable = ((UndeclaredThrowableException) undeclared).getUndeclaredThrowable();
        Result<String> result = null;
        if (throwable instanceof FlowException) {
            result = Result.error(ResultEnum.SENTINEL_FLOW.status, ResultEnum.SENTINEL_FLOW.msg);
        } else if (throwable instanceof ParamFlowException) {
            result = Result.error(ResultEnum.SENTINEL_PARAM_FLOW.status, ResultEnum.SENTINEL_PARAM_FLOW.msg);
        } else if (throwable instanceof DegradeException) {
            result = Result.error(ResultEnum.SENTINEL_DEGRADE.status, ResultEnum.SENTINEL_DEGRADE.msg);
        } else if (throwable instanceof SystemBlockException) {
            result = Result.error(ResultEnum.SENTINEL_SYSTEM.status, ResultEnum.SENTINEL_SYSTEM.msg);
        } else if (throwable instanceof AuthorityException) {
            result = Result.error(ResultEnum.SENTINEL_AUTHORITY.status, ResultEnum.SENTINEL_AUTHORITY.msg);
        } else {
            return Result.error(throwable.getMessage());
        }
        return result;
    }


}