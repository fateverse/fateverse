package cn.fateverse.common.core.exception;

import cn.fateverse.common.core.enums.ResultEnum;

public class TierDownException extends CustomException {

    public TierDownException(String message) {
        super(ResultEnum.SYS_ERROR.msg);
    }
}
