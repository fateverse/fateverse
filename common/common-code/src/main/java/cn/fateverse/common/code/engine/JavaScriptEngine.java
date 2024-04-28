package cn.fateverse.common.code.engine;

import cn.fateverse.common.code.console.ConsoleCapture;
import cn.fateverse.common.code.lock.SegmentLock;
import cn.fateverse.common.code.model.EngineResult;
import cn.fateverse.common.core.exception.CustomException;
import com.alibaba.fastjson2.JSON;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Value;

import java.util.HashMap;
import java.util.Map;

/**
 * js 工具类
 *
 * @author Clay
 * @date 2023-03-24
 */
public class JavaScriptEngine {


    // 创建 GraalVM 上下文
    private static final Context context = Context.newBuilder()
            .allowAllAccess(true)
//            .allowHostClassLoading(true)
//            .allowIO(true)
//            .allowNativeAccess(true)
            .build();


    private static final Map<String, Value> functionMap = new HashMap<>();


    /**
     * 执行js代码
     *
     * @param script       js脚本
     * @param functionName js函数名
     * @param args         参数
     * @return 返回结构
     */
    public static Object execute(String script, String functionName, Object args) {
        Value executeFunction = getFunction(functionName, script);
        Value result = executeFunction.execute(JSON.toJSONString(args));
        return result.as(Object.class);
    }


    public static EngineResult mockExecute(String script, String functionName, Object args) {
        try {
            return ConsoleCapture.capture(() -> {
                Context context = Context.newBuilder()
                        .allowAllAccess(true)
//                        .allowHostClassLoading(true)
//                        .allowIO(true)
//                        .allowNativeAccess(true)
                        .build();
                try {
                    context.eval("js", script);
                } catch (Exception e) {
                    String message = e.getMessage();
                    message = message.replace("java.lang.RuntimeException: org.graalvm.polyglot.PolyglotException: SyntaxError:", "");
                    throw new CustomException("js has error : " + message);
                }
                Value executeFunction = context.getBindings("js").getMember(functionName);
                Value javaObjectAsValue = Value.asValue(args);
                Value result = executeFunction.execute(javaObjectAsValue);
                return result.as(Object.class);
            });
        }catch (CustomException e){
            EngineResult result = new EngineResult();
            result.setSuccess(Boolean.FALSE);
            result.setConsole(e.getMessage());
            return result;
        }
    }


    private static Value getFunction(String functionName, String script) {
        return SegmentLock.lock(functionName, () -> {
            if (functionMap.containsKey(functionName)) {
                return functionMap.get(functionName);
            }
            context.eval("js", script);
            Value executeFunction = context.getBindings("js").getMember(functionName);
            functionMap.put(functionName, executeFunction);
            return executeFunction;
        });
    }


}
