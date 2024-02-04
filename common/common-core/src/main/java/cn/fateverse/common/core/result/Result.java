package cn.fateverse.common.core.result;


import cn.fateverse.common.core.enums.ResultEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.http.HttpStatus;

import java.io.Serializable;

/**
 * 返回结果集
 *
 * @author: Clay
 * @date: 2022/5/31 10:00
 */
public class Result<T> implements Serializable {
    private Integer code;
    private String msg;
    private T data;
    private transient HttpStatus status;


    public Result() {
    }

    public Result(Integer code, String msg, T data, HttpStatus status) {
        this.code = code;
        this.msg = msg;
        this.data = data;
        this.status = status;
    }

    public static <T> Result<T> ok(Integer code, String msg, T data) {
        return new Result<>(code, msg, data, HttpStatus.OK);
    }

    public static <T> Result<T> ok(Integer code, String msg, T data, HttpStatus status) {
        return new Result<>(code, msg, data, status);
    }

    public static <T> Result<T> ok(String msg, T data) {
        return Result.ok(ResultEnum.SUCCESS.code, msg, data, ResultEnum.SUCCESS.status);
    }

    public static <T> Result<T> ok(Integer code, T data) {
        return Result.ok(code, ResultEnum.SUCCESS.msg, data);
    }

    public static <T> Result<T> ok(String msg) {
        return ok(ResultEnum.SUCCESS.code, msg, null);
    }

    public static <T> Result<T> ok(T data) {
        return Result.ok(ResultEnum.SUCCESS.msg, data);
    }

    public static <T> Result<T> ok() {
        return Result.ok(ResultEnum.SUCCESS.msg, null);
    }

    public static <T> Result<T> error(String msg, T data) {
        return Result.error(ResultEnum.ERROR.code, msg, data);
    }

    public static <T> Result<T> error(Integer code, String msg) {
        return Result.error(code, msg, null);
    }

    public static <T> Result<T> notFound(String msg) {
        return Result.error(HttpStatus.NOT_FOUND.value(), msg, null, HttpStatus.NOT_FOUND);
    }

    public static <T> Result<T> error(Integer code, String msg, T data) {
        return new Result<>(code, msg, data, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public static <T> Result<T> error(Integer code, String msg, T data, HttpStatus status) {
        return new Result<>(code, msg, data, status);
    }

    public static <T> Result<T> unauthorized(String msg) {
        return new Result<>(HttpStatus.UNAUTHORIZED.value(), msg, null, HttpStatus.UNAUTHORIZED);
    }

    public static <T> Result<T> error(HttpStatus status, String msg) {
        return new Result<>(status.value(), msg, null, status);
    }

    public static <T> Result<T> error(ResultEnum resultEnum) {
        return Result.error(resultEnum.code, resultEnum.msg, null, resultEnum.status);
    }

    public static <T> Result<T> error(String msg) {
        return Result.error(ResultEnum.ERROR.code, msg, null, ResultEnum.ERROR.status);
    }

    public static <T> Result<T> error() {
        return Result.error(ResultEnum.ERROR.code, ResultEnum.ERROR.msg, null);
    }

    public static <T> Result<T> info(String msg) {
        return Result.ok(ResultEnum.NO_DATA.code, msg, null);
    }

    public static <T> Result<T> info(ResultEnum resultEnum) {
        return Result.error(resultEnum.code, resultEnum.msg, null, resultEnum.status);
    }

    public static <T> Result<T> noData() {
        return Result.ok(ResultEnum.NO_DATA.code, ResultEnum.NO_DATA.msg, null);
    }


    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    @JsonIgnore
    public HttpStatus getStatus() {
        return status;
    }

    @JsonIgnore
    public void setStatus(HttpStatus status) {
        this.status = status;
    }
}
