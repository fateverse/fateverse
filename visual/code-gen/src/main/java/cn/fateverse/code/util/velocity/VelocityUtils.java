package cn.fateverse.code.util.velocity;

import cn.fateverse.code.entity.TableColumn;
import cn.fateverse.code.entity.bo.TableGenBo;
import cn.fateverse.code.enums.BackTemplateEnum;
import cn.fateverse.code.enums.DynamicSourceEnum;
import cn.fateverse.code.enums.FrontTemplateEnum;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.text.StrFormatter;
import cn.hutool.core.util.StrUtil;
import cn.fateverse.common.core.constant.DateConstants;
import org.apache.commons.lang3.StringUtils;
import org.apache.velocity.VelocityContext;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 模板构建工具类
 *
 * @author Clay
 * @date 2022/11/18
 */
public class VelocityUtils {

    /**
     * 项目空间路径
     */
    private static final String PROJECT_PATH = "main/java";

    /**
     * mybatis空间路径
     */
    private static final String MYBATIS_PATH = "main/resources/mapper";

    /**
     * 准备环境
     *
     * @param table
     * @return
     */
    public static VelocityContext prepareContext(TableGenBo table) {
        if (DynamicSourceEnum.ORACLE.equals(table.getDataSourceType())) {
            initOracleVelocityContext(table);
        }

        String tableName = table.getTableName();
        String moduleName = table.getModuleName();
        String businessName = table.getBusinessName();
        String packageName = table.getPackageName();
        String tplCategory = table.getTplCategory();
        String functionName = table.getFunctionName();
        String serviceName = table.getServiceName();

        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("tableName", tableName);
        velocityContext.put("serviceName", serviceName);
        velocityContext.put("moduleName", moduleName);
        velocityContext.put("businessName", businessName);
        velocityContext.put("packageName", packageName);
        velocityContext.put("tplCategory", tplCategory);
        velocityContext.put("functionName", functionName);
        velocityContext.put("pkColumn", table.getPkColumn());
        velocityContext.put("dateTime", DateUtil.format(new Date(), DateConstants.YYYY_MM_DD));
        velocityContext.put("ClassName", table.getClassName());
        velocityContext.put("className", StringUtils.uncapitalize(table.getClassName()));
        velocityContext.put("author", table.getFunctionAuthor());
        velocityContext.put("permissionPrefix", StrFormatter.format("{}:{}", moduleName, businessName));
        velocityContext.put("table", table);
        velocityContext.put("columns", table.getColumns());
        return velocityContext;
    }

    /**
     * 初始化oracle相关的数据类型
     *
     * @param table
     */
    private static void initOracleVelocityContext(TableGenBo table) {
        table.setTableName(table.getTableName().toLowerCase());
        List<TableColumn> columns = table.getColumns();
        columns = columns.stream().peek(column -> column.setColumnName(column.getColumnName().toLowerCase())).collect(Collectors.toList());
        table.setColumns(columns);
    }


    public static List<String> getTemplateList(TableGenBo table) {
        List<String> templateList = new ArrayList<>();
        templateList.add("vm/java/entity.java.vm");
        templateList.add("vm/java/entityDto.java.vm");
        templateList.add("vm/java/entityQuery.java.vm");
        templateList.add("vm/java/entityVo.java.vm");
        templateList.add("vm/java/controller.java.vm");
        templateList.add("vm/java/service.java.vm");
        if (BackTemplateEnum.MYBATIS.equals(table.getBackTemplate())) {
            templateList.add("vm/java/mybatis/serviceImpl.java.vm");
            templateList.add("vm/java/mybatis/mapper.java.vm");
            templateList.add(table.getDataSourceType().getDynamicDataSourceFactory().getMapperTemplate());
        } else {
            templateList.add("vm/java/mybatisplus/serviceImpl.java.vm");
            templateList.add("vm/java/mybatisplus/mapper.java.vm");
        }
        if (FrontTemplateEnum.VUE.equals(table.getFrontTemplate())) {
            templateList.add("vm/vue/index.vue.vm");
            templateList.add("vm/vue/api.js.vm");
        } else {
            templateList.add("vm/react/type.ts.vm");
            templateList.add("vm/react/api.ts.vm");
            templateList.add("vm/react/view.tsx.vm");
        }
        return templateList;
    }


    public static String getFileName(String template, TableGenBo table) {
        String className = table.getClassName();
        String packageName = table.getPackageName();
        String moduleName = table.getModuleName();
        String businessName = table.getBusinessName();
        String javaPath = PROJECT_PATH + "/" + StringUtils.replace(packageName, ".", "/");
        String mybatisPath = MYBATIS_PATH + "/" + table.getModuleName();
        String frontPath = table.getFrontTemplate().equals("0") ? "vue" : "react";
        String fileName = "";

        if (template.contains("entity.java.vm")) {
            fileName = StrFormatter.format("{}/entity/{}.java", javaPath, className);
        } else if (template.contains("entityDto.java.vm")) {
            fileName = StrFormatter.format("{}/entity/dto/{}Dto.java", javaPath, className);
        } else if (template.contains("entityQuery.java.vm")) {
            fileName = StrFormatter.format("{}/entity/query/{}Query.java", javaPath, className);
        } else if (template.contains("entityVo.java.vm")) {
            fileName = StrFormatter.format("{}/entity/vo/{}Vo.java", javaPath, className);
        } else if (template.contains("rel-entity.java.vm")) {
            fileName = StrFormatter.format("{}/entity/{}.java", javaPath, className);
        } else if (template.contains("mapper.java.vm")) {
            fileName = StrFormatter.format("{}/mapper/{}Mapper.java", javaPath, className);
        } else if (template.contains("service.java.vm")) {
            fileName = StrFormatter.format("{}/service/{}Service.java", javaPath, className);
        } else if (template.contains("serviceImpl.java.vm")) {
            fileName = StrFormatter.format("{}/service/impl/{}ServiceImpl.java", javaPath, className);
        } else if (template.contains("controller.java.vm")) {
            fileName = StrFormatter.format("{}/controller/{}Controller.java", javaPath, className);
        } else if (template.contains("mapperMySql.xml.vm") || template.contains("mapperOracle.xml.vm")) {
            fileName = StrFormatter.format("{}/{}Mapper.xml", mybatisPath, className);
        } else if (template.contains("table.sql.vm")) {
            fileName = className + "menu.sql";
        } else if (template.contains("api.js.vm")) {
            fileName = StrFormatter.format("{}/api/{}/{}.js", frontPath, moduleName, businessName);
        } else if (template.contains("index.vue.vm")) {
            fileName = StrFormatter.format("{}/views/{}/{}/index.vue", frontPath, moduleName, businessName);
        } else if (template.contains("index-tree.vue.vm")) {
            fileName = StrFormatter.format("{}/views/{}/{}/index.vue", frontPath, moduleName, businessName);
        } else if (template.contains("type.ts.vm")) {
            fileName = StrFormatter.format("{}/type/{}/{}/indexType.ts", frontPath, moduleName, businessName);
        } else if (template.contains("api.ts.vm")) {
            fileName = StrFormatter.format("{}/api/{}/{}.ts", frontPath, moduleName, businessName);
        } else if (template.contains("view.tsx.vm")) {
            fileName = StrFormatter.format("{}/views/{}/{}/index.tsx", frontPath, moduleName, businessName);
        }
        return fileName;
    }

    public static String getPreviewName(String template, String className) {
        String fileName = "";
        if (template.contains("entity.java.vm")) {
            fileName = StrFormatter.format("{}.java", className);
        } else if (template.contains("entityDto.java.vm")) {
            fileName = StrFormatter.format("{}Dto.java", className);
        } else if (template.contains("entityQuery.java.vm")) {
            fileName = StrFormatter.format("{}Query.java", className);
        } else if (template.contains("entityVo.java.vm")) {
            fileName = StrFormatter.format("{}Vo.java", className);
        } else
            //if (template.contains("sub-entity.java.vm") && StringUtils.equals(GenConstants.TPL_SUB, className)) {
            //    fileName = StrFormatter.format("{}.java", className);
            //} else
            if (template.contains("rel-entity.java.vm")) {
                fileName = StrFormatter.format("{}.java", className);
            } else if (template.contains("mapper.java.vm")) {
                fileName = StrFormatter.format("{}Mapper.java", className);
            } else if (template.contains("service.java.vm")) {
                fileName = StrFormatter.format("{}Service.java", className);
            } else if (template.contains("serviceImpl.java.vm")) {
                fileName = StrFormatter.format("{}ServiceImpl.java", className);
            } else if (template.contains("controller.java.vm")) {
                fileName = StrFormatter.format("{}Controller.java", className);
            } else if (template.contains("mapperMySql.xml.vm") || template.contains("mapperOracle.xml.vm")) {
                fileName = StrFormatter.format("{}Mapper.xml", className);
            } else if (template.contains("table.sql.vm")) {
                fileName = className + "menu.sql";
            } else if (template.contains("api.js.vm")) {
                fileName = StrFormatter.format("{}.js", StrUtil.lowerFirst(className));
            } else if (template.contains("index.vue.vm")) {
                fileName = "index.vue";
            } else if (template.contains("index-tree.vue.vm")) {
                fileName = "index.vue";
            } else if (template.contains("type.ts.vm")) {
                fileName = "indexType.ts";
            } else if (template.contains("api.ts.vm")) {
                fileName = "indexApi.ts";
            } else if (template.contains("view.tsx.vm")) {
                fileName = "view.tsx";
            }
        return fileName;
    }

}
