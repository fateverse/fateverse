package cn.fateverse.common.code.console;

import cn.fateverse.common.code.model.EngineResult;
import cn.fateverse.common.core.exception.CustomException;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

/**
 * 控制台输出捕获
 *
 * @author Clay
 * @date 2024/4/22 17:08
 */
public class ConsoleCapture {


    /**
     * 捕获方法
     *
     * @param task 任務
     * @return 返回结果
     */
    public static EngineResult capture(Task task) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintStream oldOut = System.out;
        System.setOut(new PrintStream(baos));
        Object result;
        String capturedOutput;
        try {
            result = task.execute();
        } catch (Exception e) {
            if (e instanceof CustomException) {
                throw (CustomException) e;
            }
            throw new RuntimeException(e);
        } finally {
            System.setOut(oldOut);
            // 从捕获的字节数组输出流中获取打印的文本
            capturedOutput = baos.toString();
        }
        return new EngineResult(result, capturedOutput);
    }


    public interface Task {
        Object execute() throws Exception;
    }


}
