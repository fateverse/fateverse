package cn.fateverse.common.code.sandbox;

import java.net.URL;
import java.net.URLClassLoader;

public class SandboxClassLoader extends URLClassLoader {


    public SandboxClassLoader(final URL[] urls) {
        super(urls);
    }

}
