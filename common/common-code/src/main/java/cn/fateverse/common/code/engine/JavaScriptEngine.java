package cn.fateverse.common.code.engine;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

/**
 * js 工具类
 *
 * @author Clay
 * @date 2023-03-24
 */
public class JavaScriptEngine {

    /**
     * 执行js代码
     * @param script js脚本
     * @param function js函数名
     * @param args 参数
     * @return 返回结构
     * @param <T> 泛型类型
     */
    public static <T> T executeScript(String script, String function, Object... args) {
        ScriptEngineManager manager = new ScriptEngineManager();
        ScriptEngine engine = manager.getEngineByName("JavaScript");
        try {
            engine.eval(script);
            Invocable inv = (Invocable) engine;
            return (T) inv.invokeFunction(function, args);
        } catch (ScriptException | NoSuchMethodException e) {
            throw new RuntimeException(e);
        }
    }


}
