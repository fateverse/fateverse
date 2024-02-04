package cn.fateverse.common.core.utils.convert;

import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

/**
 * @author Clay
 * @date 2022/11/16
 */
public class ObjectConfig {


    private boolean copy;
    private Map<String,String> mapper;
    private Set<String> exclude;

    public ObjectConfig() {
        mapper = new LinkedHashMap<>();
        exclude = new LinkedHashSet<>();
        copy = true;
    }

    public void setMapper(String targetKey, String sourceKey){
        mapper.put(targetKey,sourceKey);
    }

    public void setExclude(String excludeKey){
        exclude.add(excludeKey);
    }

    public Map<String,String> getMapper(){
        return mapper;
    }

    public Set<String> getExclude() {
        return exclude;
    }


    public void setOption(String value,String label){
        this.copy = false;
        mapper.put("label",label);
        mapper.put("value",value);
    }

    public boolean isCopy() {
        return copy;
    }

    public void setCopy(boolean copy) {
        this.copy = copy;
    }

}
