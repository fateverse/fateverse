package cn.fateverse.common.core.utils.convert;


import cn.hutool.core.util.StrUtil;

import java.util.*;

/**
 * @author Clay
 * @date 2022/11/16
 * TreeConfig的配置文件
 */
public class TreeConfig {


    private boolean copy;

    private final Map<String, String> mapper;
    private final Set<String> exclude;

    private String idField;

    private String parentField;

    private String childrenField;

    private Boolean isStore = false;

    private String storeField;


    public TreeConfig() {
        mapper = new LinkedHashMap<>();
        exclude = new LinkedHashSet<>();
        copy = true;
        this.idField = "id";
        this.parentField = "parentId";
        this.childrenField = "children";
    }

    public void setParentField(String parentField) {
        if (StrUtil.isEmpty(parentField)) {
            return;
        }
        this.parentField = parentField;
    }

    public Boolean getStore() {
        return isStore;
    }

    public String getStoreField() {
        return storeField;
    }

    public String getParentField() {
        return parentField;
    }


    public String getIdField() {
        return idField;
    }

    public void setIdField(String idField) {
        if (StrUtil.isEmpty(idField)) {
            return;
        }
        this.idField = idField;
    }

    public void setSortOrder(Boolean isStore,String storeField) {
        this.isStore = isStore;
        this.storeField = storeField;
    }

    public String getChildrenField() {
        return childrenField;
    }

    public void setChildrenField(String childrenField) {
        if (StrUtil.isEmpty(childrenField)) {
            return;
        }
        this.childrenField = childrenField;
    }

    public void setMapper(String targetKey, String sourceKey) {
        mapper.put(targetKey, sourceKey);
    }

    public void setExclude(String excludeKey) {
        exclude.add(excludeKey);
    }

    public Map<String, String> getMapper() {
        return mapper;
    }

    public Set<String> getExclude() {
        return exclude;
    }

    public void setOption(String valueField, String labelField) {
        this.copy = false;
        mapper.put("value", valueField);
        mapper.put("label", labelField);
    }

    public boolean isCopy() {
        return copy;
    }

    public void setCopy(boolean copy) {
        this.copy = copy;
    }

    /**
     * 空实现
     */
    //@Override
    //public void build(TreeConfig treeConfig) {
    //}


}
