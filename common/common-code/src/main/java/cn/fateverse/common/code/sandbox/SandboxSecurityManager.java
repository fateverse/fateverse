package cn.fateverse.common.code.sandbox;

import cn.fateverse.common.code.engine.JavaCodeEngine;

import java.io.FilePermission;
import java.lang.reflect.ReflectPermission;
import java.security.Permission;
import java.util.Map;
import java.util.PropertyPermission;
import java.util.Set;

public class SandboxSecurityManager extends SecurityManager {

    private final Map<String, JavaCodeEngine.CacheWrapper> classCache;

    public SandboxSecurityManager(Map<String, JavaCodeEngine.CacheWrapper> classCache) {
        this.classCache = classCache;
    }

    @Override
    public void checkPermission(Permission perm) {
        if (isSandboxCode(perm)) {
            if (!isAllowedPermission(perm)) {
                throw new SecurityException("Permission denied " + perm);
            }
        }
    }


    private boolean isSandboxCode(Permission perm) {
        Set<String> classKeySet = classCache.keySet();
        for (String key : classKeySet) {
            if (perm.getName().contains(key)) {
                return true;
            }
        }
        return false;
    }


    private boolean isAllowedPermission(Permission permission) {
        //权限：用于校验文件系统访问权限，包括读取、写入、删除文件，以及目录操作。权限名称可能包括文件路径和操作，如 "read", "write", "delete", "execute" 等。
        if (permission instanceof FilePermission) {
            System.out.println("触发文件读写权限");
            return false;
        }
        //权限：用于校验运行时权限，如程序启动、关闭虚拟机等。您可以根据名称进行控制，如 "exitVM"、"setSecurityManager" 等。
        if (permission instanceof RuntimePermission) {
            System.out.println("用于校验运行时权限");
            return false;
        }
        //权限：用于校验Java反射操作的权限，如 `suppressAccessChecks`、`newProxyInPackage` 等。
        if (permission instanceof ReflectPermission) {
            System.out.println("用于校验Java反射操作的权限");
            return false;
        }
        //权限：用于校验系统属性的权限，包括读取和设置系统属性。权限名称通常以属性名称和操作（如 "read" 或 "write"）表示。
        if (permission instanceof PropertyPermission) {
            System.out.println("用于校验系统属性的权限");
            return false;
        }
        // 权限：用于校验数据库访问权限，包括连接数据库、执行SQL语句等。权限名称通常与数据库URL和操作相关。
//        if (permission instanceof SQLPermission) {
//            return false;
//
//        }
        //权限：用于校验网络套接字的权限，包括连接到特定主机和端口。权限名称通常以主机名和端口号的形式表示，如 "www.example.com:80".
//        if (permission instanceof SocketPermission) {
//            return false;
//
//        }
        //权限：用于校验安全管理器操作的权限，如 `createAccessControlContext`、`setPolicy` 等。
//        if (permission instanceof SecurityPermission) {
//            return false;
//
//        }
//        //序列化
//        if (permission instanceof SerializablePermission) {
//            return false;
//        }
//        System.out.println(permission);
        return true;
    }


}
