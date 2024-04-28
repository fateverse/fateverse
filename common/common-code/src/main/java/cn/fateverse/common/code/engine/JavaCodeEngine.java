package cn.fateverse.common.code.engine;


import cn.fateverse.common.code.console.ConsoleCapture;
import cn.fateverse.common.code.exception.SandboxClassNotFoundException;
import cn.fateverse.common.code.lock.SegmentLock;
import cn.fateverse.common.code.model.EngineResult;
import cn.fateverse.common.code.sandbox.SandboxClassLoader;
import cn.fateverse.common.code.sandbox.SandboxSecurityManager;
import cn.fateverse.common.core.exception.CustomException;
import lombok.Getter;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.ObjectUtils;

import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;
import java.io.*;
import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author Clay
 * @date 2023-10-24
 */
@Slf4j
public class JavaCodeEngine {

    private final String JAVA_SUFFIX = ".java";

    private final String CLASS_SUFFIX = ".class";

    private final String CLASS_PATH;

    private final URL url;

    private final Map<String, CacheWrapper> classCache = new ConcurrentHashMap<>();


    private final SandboxSecurityManager securityManager = new SandboxSecurityManager(classCache);

    // 获取Java编译器
    private final JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();


    public JavaCodeEngine(String classPath) {
        try {
            CLASS_PATH = classPath;
            File file = new File(CLASS_PATH);
            if (!file.exists()) {
                file.mkdirs();
            }
            url = file.toURI().toURL();
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
    }


    /**
     * 用于在开发环境中执行代码的私有方法。
     *
     * @param code       需要执行的代码字符串
     * @param className  类名
     * @param methodName 方法名
     * @param args       参数数组
     * @return 执行结构
     */
    @SneakyThrows
    public EngineResult mockExecute(String code, String className, String methodName, Object[] args) {
        Class<?> loadClass = null;
        try {
            // 加锁，确保类只加载一次
            loadClass = SegmentLock.lock(className, () -> {
                URLClassLoader tempClassLoader = null;
                try {
                    // 创建一个URLClassLoader，用于加载代码字符串
                    tempClassLoader = new URLClassLoader(new URL[]{url});
                    // 编译代码字符串为类
                    return compilerClass(className, code, tempClassLoader);
                } catch (Exception e) {
                    e.printStackTrace();
                    if (e instanceof CustomException) {
                        throw (CustomException) e;
                    }
                    // 异常处理，并抛出自定义的SandboxClassNotFoundException异常
                    throw new SandboxClassNotFoundException(e.getMessage());
                } finally {
                    if (tempClassLoader != null) {
                        tempClassLoader = null;
                    }
                }
            });
            // 获取需要执行的方法
            Method method = getMethod(methodName, loadClass);
            // 设置安全检查器
            System.setSecurityManager(securityManager);
            // 执行方法并返回结果
            return ConsoleCapture.capture(() -> method.invoke(null, args));
        } catch (CustomException e) {
            EngineResult result = new EngineResult();
            result.setSuccess(Boolean.FALSE);
            result.setConsole(e.getMessage());
            return result;
        } finally {
            // 清空安全检查器
            System.setSecurityManager(null);
            if (loadClass != null) {
                loadClass = null;
            }
            // 删除生成的java文件
            File javaFile = new File(CLASS_PATH + className + JAVA_SUFFIX);
            if (javaFile.exists()) {
                javaFile.delete();
            }
            // 删除生成的class文件
            File classFile = new File(CLASS_PATH + className + CLASS_SUFFIX);
            if (classFile.exists()) {
                classFile.delete();
            }
            // 执行垃圾回收
            System.gc();
        }
    }

    /**
     * 线上环境执行
     *
     * @param code       需要执行的代码字符串
     * @param className  类名
     * @param methodName 方法名
     * @param args       参数数组
     * @return 执行结构
     */
    public Object execute(String code, String className, String methodName, Object[] args) {
        try {
            Class<?> loadClass = null;
            //从缓存中获取
            CacheWrapper wrapper = classCache.get(className);
            //缓存中不存在
            if (wrapper == null) {
                //加载
                wrapper = getLoadClass(code, className);
            }
            //获取到类信息
            loadClass = wrapper.getClazz();
            //获取方法
            Method method = getMethod(methodName, loadClass);
            //开启安全模式
            System.setSecurityManager(securityManager);
            //执行方法
            return method.invoke(null, args);
        } catch (Exception e) {
            remove(className);
            e.printStackTrace();
        } finally {
            System.setSecurityManager(null);
        }
        return null;
    }

    /**
     * 获取到方法
     *
     * @param methodName 方法名称
     * @param loadClass  类信息
     * @return 方法对象
     */
    private Method getMethod(String methodName, Class<?> loadClass) {
        Method method = null;
        for (Method declaredMethod : loadClass.getDeclaredMethods()) {
            if (declaredMethod.getName().equals(methodName)) {
                method = declaredMethod;
            }
        }
        return method;
    }

    /**
     * 获取到编译完成的Class对象
     *
     * @param code      需要编译的代码
     * @param className 类名
     * @return 编译后的Java对象
     */
    private CacheWrapper getLoadClass(String code, String className) {
        //使用分段锁,提高效率,放多并发情况下多次对同一个类进行编译
        return SegmentLock.lock(className, () -> {
            try {
                URLClassLoader classLoader = new SandboxClassLoader(new URL[]{url});
                //执行编译
                Class<?> tempClass = compilerClass(className, code, classLoader);
                //创建缓存包装对象
                CacheWrapper wrapper = new CacheWrapper(tempClass, classLoader);
                //将编译之后的类对象放在缓存中,提高线上环境的运行效率
                classCache.put(className, wrapper);
                return wrapper;
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
    }

    /**
     * 编译Java代码
     *
     * @param className   类名
     * @param code        Java代码
     * @param classLoader 类加载器
     * @return 编译完成的类对象
     */
    private Class<?> compilerClass(String className, String code, URLClassLoader classLoader) {
        File tempFile = new File(CLASS_PATH + className + JAVA_SUFFIX);
        try (FileWriter writer = new FileWriter(tempFile)) {
            writer.write(code);
            writer.close();
            ByteArrayOutputStream errorStream = new ByteArrayOutputStream(10240);
            // 编译.java文件
            compiler.run(null, null, errorStream, tempFile.getPath());
            String trace = errorStream.toString();//存放控制台输出的字符串
            if (!ObjectUtils.isEmpty(trace)) {
                trace = trace.replace(CLASS_PATH + className + ".", "");
                throw new CustomException("编译错误: " + trace);
            }
            return classLoader.loadClass(className);
        } catch (Exception e) {
            e.printStackTrace();
            if (e instanceof CustomException) {
                throw (CustomException) e;
            }
            throw new CustomException("执行或者编辑错误!");
        }
    }

    /**
     * 删除类
     *
     * @param className 删除类
     * @return 删除结果
     */
    public Boolean remove(String className) {
        return SegmentLock.lock(className, () -> {
            CacheWrapper wrapper = classCache.get(className);
            if (wrapper != null) {
                classCache.remove(className);
                wrapper.remove();
            }
            //进行gc 垃圾挥手
            System.gc();
            //删除Java文件
            File javaFile = new File(CLASS_PATH + className + JAVA_SUFFIX);
            if (javaFile.exists()) {
                javaFile.delete();
            }
            //删除class文件
            File classFile = new File(CLASS_PATH + className + CLASS_SUFFIX);
            if (classFile.exists()) {
                classFile.delete();
            }
            return true;
        });
    }


    @Getter
    public static class CacheWrapper {

        private Class<?> clazz;

        private URLClassLoader classLoader;

        public CacheWrapper(Class<?> clazz, URLClassLoader classLoader) {
            this.clazz = clazz;
            this.classLoader = classLoader;
        }


        public void remove(){
            clazz = null;
            classLoader = null;
        }
    }
}
