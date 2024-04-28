package cn.fateverse.common.code.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Clay
 * @date 2024/4/22 17:10
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EngineResult {

    private Object result;


    private String console;

    private Boolean success;

    public EngineResult(Object result, String console) {
        success = true;
        this.result = result;
        this.console = console;
    }
}
