package cn.fateverse.common.code.engine;


import cn.fateverse.common.code.config.JavaCodeProperties;
import cn.fateverse.common.code.exception.SandboxClassNotFoundException;
import cn.fateverse.common.code.lock.SegmentLock;
import cn.fateverse.common.code.sandbox.SandboxClassLoader;
import cn.fateverse.common.code.sandbox.SandboxSecurityManager;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
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

    private final URLClassLoader classLoader;

    private final Map<String, Class<?>> classCache = new ConcurrentHashMap<>();


    private final SandboxSecurityManager securityManager = new SandboxSecurityManager(classCache);

    // 获取Java编译器
    private final JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();


    public JavaCodeEngine(JavaCodeProperties javaCodeProperties) {
        try {
            CLASS_PATH = javaCodeProperties.getClassPath();
            File file = new File(CLASS_PATH);
            if (!file.exists()) {
                file.mkdirs();
            }
            url = file.toURI().toURL();
            classLoader = new SandboxClassLoader(new URL[]{url});
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
    }


    /**
     * 执行方法
     *
     * @param code        代码字符串
     * @param className   类名
     * @param methodName  方法名
     * @param paramClass  参数类型数组
     * @param args        参数数组
     * @param development 是否为开发环境 开发环境下会将生成的类在执行完成后删除,不是生产环境则会缓存提高运行效率
     * @return 执行结果
     */
    public <T> T execute(String code, String className, String methodName, Class<?>[] paramClass, Object[] args, boolean development) {
        if (development) {
            return developmentExecute(code, className, methodName, paramClass, args);
        } else {
            return onlineExecute(code, className, methodName, paramClass, args);
        }
    }


    /**
     * 用于在开发环境中执行代码的私有方法。
     *
     * @param code       需要执行的代码字符串
     * @param className  类名
     * @param methodName 方法名
     * @param paramClass 参数类型数组
     * @param args       参数数组
     * @param <T>        接收泛型
     * @return 执行结构
     */
    @SneakyThrows
    private <T> T developmentExecute(String code, String className, String methodName, Class<?>[] paramClass, Object[] args) {
        Class<?> loadClass = null;
        try {
            // 加锁，确保类只加载一次
            loadClass = SegmentLock.lock(className, () -> {
                URLClassLoader tempClassLoader = null;
                try {
                    // 创建一个URLClassLoader，用于加载代码字符串
                    tempClassLoader = new URLClassLoader(new URL[]{url});
                    // 编译代码字符串为类
                    Class<?> tempClass = compilerClass(className, code, tempClassLoader);
                    // 将编译好的类放入缓存
                    classCache.put(className, tempClass);
                    return tempClass;
                } catch (Exception e) {
                    e.printStackTrace();
                    // 异常处理，并抛出自定义的SandboxClassNotFoundException异常
                    throw new SandboxClassNotFoundException(e.getMessage());
                } finally {
                    if (tempClassLoader != null) {
                        tempClassLoader = null;
                    }
                }
            });
            // 获取需要执行的方法
            Method method = loadClass.getMethod(methodName, paramClass);
            // 设置安全检查器
            System.setSecurityManager(securityManager);
            // 执行方法并返回结果
            return (T) method.invoke(null, args);
        } finally {
            // 从缓存中移除编译好的类
            classCache.remove(className);
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
     * @param paramClass 参数类型数组
     * @param args       参数数组
     * @param <T>        接收泛型
     * @return 执行结构
     */
    private <T> T onlineExecute(String code, String className, String methodName, Class<?>[] paramClass, Object[] args) {
        try {
            Class<?> loadClass = null;
            loadClass = classCache.get(className);
            if (loadClass == null) {
                loadClass = getLoadClass(code, className);
                Method method = loadClass.getMethod(methodName, paramClass);
                System.setSecurityManager(securityManager);
                return (T) method.invoke(null, args);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            System.setSecurityManager(null);
            File javaFile = new File(CLASS_PATH + className + JAVA_SUFFIX);
            if (javaFile.exists()) {
                javaFile.delete();
            }
            File classFile = new File(CLASS_PATH + className + CLASS_SUFFIX);
            if (classFile.exists()) {
                classFile.delete();
            }
        }
        return null;
    }

    /**
     * 获取到编译完成的Class对象
     *
     * @param code      需要编译的代码
     * @param className 类名
     * @return 编译后的Java对象
     */
    private Class<?> getLoadClass(String code, String className) {
        //使用分段锁,提高效率,放多并发情况下多次对同一个类进行编译
        return SegmentLock.lock(className, () -> {
            try {
                //执行编译
                Class<?> tempClass = compilerClass(className, code, classLoader);
                //将编译之后的类对象放在缓存中,提高线上环境的运行效率
                classCache.put(className, tempClass);
                return tempClass;
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
        log.info(code);
        File tempFile = new File(CLASS_PATH + className + JAVA_SUFFIX);
        try (FileWriter writer = new FileWriter(tempFile)) {
            writer.write(code);
            writer.close();
            // 编译.java文件
            compiler.run(null, null, null, tempFile.getPath());
            return classLoader.loadClass(className);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}
