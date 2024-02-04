package cn.fateverse.code.factory.impl;

import cn.hutool.core.util.StrUtil;
import cn.fateverse.code.config.CodeGenConfig;
import cn.fateverse.code.entity.CodeDataSource;
import cn.fateverse.code.entity.DynamicPage;
import cn.fateverse.code.entity.Table;
import cn.fateverse.code.entity.TableColumn;
import cn.fateverse.code.entity.dto.TableDto;
import cn.fateverse.code.enums.DynamicSourceEnum;
import cn.fateverse.code.factory.DynamicTableService;
import cn.fateverse.code.util.constant.CodeGenConstants;
import cn.fateverse.common.core.entity.PageInfo;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.utils.TableSupport;
import cn.fateverse.common.mybatis.utils.PageUtils;
import cn.fateverse.common.security.utils.SecurityUtils;
import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONException;
import com.alibaba.fastjson2.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.datasource.unpooled.UnpooledDataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.springframework.beans.BeanUtils;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import javax.sql.DataSource;
import java.util.*;

/**
 * 抽象动态表格
 *
 * @author Clay
 * @date 2023-07-24
 */
@Slf4j
public abstract class AbstractDynamicTableService implements DynamicTableService {

    public SqlSessionFactory getSqlSessionFactory(CodeDataSource dataSource, String mapperPath) {
        SqlSessionFactoryBean sessionFactoryBean = new SqlSessionFactoryBean();
        //获取需要的xml文件
        Resource[] resources = getResources(mapperPath);
        sessionFactoryBean.setMapperLocations(resources);
        DynamicSourceEnum dbType = dataSource.getType();
        String baseUrl;
        if (1 == dataSource.getConfType()) {
            baseUrl = getDataBaseUrl(dataSource);
        } else {
            baseUrl = dataSource.getJdbcUrl();
        }
        DataSource sqlDataSource = new UnpooledDataSource(dbType.getDrive(), baseUrl,
                dataSource.getUsername(), dataSource.getPassword());
        sessionFactoryBean.setDataSource(sqlDataSource);
        SqlSessionFactory sqlSessionFactory;
        try {
            sqlSessionFactory = sessionFactoryBean.getObject();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return sqlSessionFactory;
    }

    @Override
    public DynamicPage getDynamicPage() {
        PageInfo pageInfo = TableSupport.buildPageRequest();
        Integer startNum = PageUtils.getStartSize(pageInfo);
        Integer endNum = startNum + pageInfo.getPageSize();
        return DynamicPage.builder()
                .startNum(startNum)
                .endNum(endNum)
                .build();
    }

    @Override
    public Map<String, Object> getParams(CodeDataSource dataSource) {
        return new HashMap<>();
    }

    @Override
    public TableDto initTable(Table table, List<TableColumn> tableColumns) {//包名
        table.setPackageName(CodeGenConfig.getPackageName());
        //作者
        table.setFunctionAuthor(CodeGenConfig.getAuthor());
        //创建人
        table.setCreateBy(SecurityUtils.getUsername());
        //功能名
        table.setFunctionName(table.getTableComment());
        //模块名
        table.setModuleName(getModel(CodeGenConfig.getPackageName()));
        //Java Class 大驼峰名称
        table.setClassName(getClassName(table.getTableName()));
        //业务名称
        table.setBusinessName(getBusinessName(table.getTableName()));

        TableDto tableDto = new TableDto();
        BeanUtils.copyProperties(table, tableDto);
        tableColumns.forEach(column -> {
            initBeforeColumn(column);
            initColumn(column);
            initAfterColumn(column);
        });
        tableDto.setColumns(tableColumns);
        return tableDto;
    }


    /**
     * 预先初始化公共字段
     *
     * @param column 列
     */
    abstract void initColumn(TableColumn column);

    /**
     * 预先初始化公共字段
     *
     * @param column 列
     */
    private void initBeforeColumn(TableColumn column) {
        column.setCreateBy(SecurityUtils.getUsername());
        column.setIsRequired(CodeGenConstants.NO_REQUIRE);
        column.setJavaField(StrUtil.toCamelCase(column.getColumnName().toLowerCase()));
        column.setJavaType(CodeGenConstants.TYPE_STRING);
        column.setIsRegular(0L);
        column.setDictType(null);
    }

    /**
     * 后处理公共字段
     *
     * @param tableColumn 列
     */
    private void initAfterColumn(TableColumn tableColumn) {
        String columnName = tableColumn.getColumnName().toLowerCase();
        // 编辑字段
        if (!arraysContains(CodeGenConstants.COLUMN_NAME_NOT_EDIT_INSERT, columnName) && !tableColumn.isPk()) {
            tableColumn.setIsEdit(CodeGenConstants.REQUIRE);
        }
        if (!arraysContains(CodeGenConstants.COLUMN_NAME_NOT_EDIT_INSERT, columnName) && !tableColumn.isPk()) {
            tableColumn.setIsInsert(CodeGenConstants.REQUIRE);
        }
        // 列表字段
        if (!arraysContains(CodeGenConstants.COLUMN_NAME_NOT_LIST, columnName) && !tableColumn.isPk()) {
            tableColumn.setIsList(CodeGenConstants.REQUIRE);
        }
        // 查询字段
        if (!arraysContains(CodeGenConstants.COLUMN_NAME_NOT_QUERY, columnName) && !tableColumn.isPk()) {
            tableColumn.setIsQuery(CodeGenConstants.REQUIRE);
        }
        // 查询字段类型
        if (StringUtils.endsWithIgnoreCase(columnName, CodeGenConstants.NAME_SUFFIX)) {
            tableColumn.setQueryType(CodeGenConstants.QUERY_LIKE);
        }
        // 状态字段设置单选框
        if (StringUtils.endsWithIgnoreCase(columnName, CodeGenConstants.STATE_SUFFIX)) {
            tableColumn.setHtmlType(CodeGenConstants.HTML_RADIO);
        }
        // 类型&性别字段设置下拉框
        else if (StringUtils.endsWithIgnoreCase(columnName, CodeGenConstants.TYPE_SUFFIX) || StringUtils.endsWithIgnoreCase(columnName, CodeGenConstants.SEX_SUFFIX)) {
            tableColumn.setHtmlType(CodeGenConstants.HTML_SELECT);
        }
        // 图片字段设置图片上传控件
        else if (StringUtils.endsWithIgnoreCase(columnName, CodeGenConstants.IMAGE_SUFFIX)) {
            tableColumn.setHtmlType(CodeGenConstants.HTML_IMAGE_UPLOAD);
        }
        // 文件字段设置文件上传控件
        else if (StringUtils.endsWithIgnoreCase(columnName, CodeGenConstants.FILE_SUFFIX)) {
            tableColumn.setHtmlType(CodeGenConstants.HTML_FILE_UPLOAD);
        }
        // 内容字段设置富文本控件
        else if (StringUtils.endsWithIgnoreCase(columnName, CodeGenConstants.CONTENT_SUFFIX)) {
            tableColumn.setHtmlType(CodeGenConstants.HTML_EDITOR);
        }
    }

    /**
     * 判断数据中是否存在这个参数
     *
     * @param arr         数组
     * @param targetValue 目标值
     * @return 结果
     */
    public boolean arraysContains(String[] arr, String targetValue) {
        return Arrays.asList(arr).contains(targetValue);
    }

    /**
     * 检查参数设置
     *
     * @param paramStr 参数str
     * @param msg      失败信息
     * @param keys     参数key
     * @return 参数对象
     */
    public JSONObject checkParam(String paramStr, String msg, String... keys) {
        if (StrUtil.isBlank(paramStr)) {
            throw new CustomException(msg);
        }
        JSONObject params;
        try {
            params = JSON.parseObject(paramStr);
            for (String key : keys) {
                if (StrUtil.isBlank(params.getString(key))) {
                    log.error(key + "is blank");
                    throw new CustomException(msg);
                }
            }
        } catch (JSONException e) {
            throw new CustomException(msg);
        }
        return params;
    }

    /**
     * 获取到mybatis xml资源
     *
     * @param location 资源路径
     * @return 资源组
     */
    public Resource[] getResources(String location) {
        PathMatchingResourcePatternResolver pathMatchingResourcePatternResolver = new PathMatchingResourcePatternResolver();
        Resource resource = pathMatchingResourcePatternResolver.getResource(location);
        Resource baseResource = pathMatchingResourcePatternResolver.getResource("classpath:mapper/dynamic/DynamicTableMapper.xml");
        Resource[] resources = new Resource[2];
        resources[0] = resource;
        resources[1] = baseResource;
        return resources;
    }

    /**
     * 获取模块名称
     *
     * @param packageName 包名
     * @return 模块名
     */
    public String getModel(String packageName) {
        int lastIndex = packageName.lastIndexOf(".") + 1;
        int nameLength = packageName.length();
        return packageName.substring(lastIndex, nameLength);
    }

    /**
     * 获取Class类名,去除前缀
     *
     * @param tableName 表名称
     * @return 处理完成的class名称
     */
    public String getClassName(String tableName) {
        String finalTableName = tableName.toLowerCase();
        if (CodeGenConfig.isAutoRemovePre()) {
            List<String> tablePrefix = CodeGenConfig.getTablePrefix();
            Optional<String> first = tablePrefix.stream().filter(finalTableName::startsWith).findFirst();
            if (first.isPresent()) {
                String text = first.get();
                finalTableName = finalTableName.replaceFirst(text, "");
            }
        }
        return StringUtils.capitalize(StrUtil.toCamelCase(finalTableName));

    }

    /**
     * 获取业务名称
     *
     * @param tableName 表名称
     * @return 业务名称
     */
    public String getBusinessName(String tableName) {
        tableName = tableName.toLowerCase();
        String[] split = tableName.split("_");
        return split[split.length - 1].toLowerCase();
    }

    /**
     * 获取Mysql or MariaDB数据库类型
     *
     * @param columnType 列类型
     * @return 数据类型
     */
    public String getDbType(String columnType) {
        if (StringUtils.indexOf(columnType, "(") > 0) {
            return StringUtils.substringBefore(columnType, "(");
        } else {
            return columnType;
        }
    }

    /**
     * todo mysql获取到字段长度,需要将字段长度和类型分别存放到两个字段里面去
     *
     * @param columnType 列类型
     * @return 长度
     */
    public Integer getColumnLength(String columnType) {
        //todo 需要对带有小数的数据类型进行特殊判断
        if (StringUtils.indexOf(columnType, "(") > 0) {
            String length = StringUtils.substringBetween(columnType, "(", ")");
            return Integer.valueOf(length);
        } else {
            return 0;
        }
    }

}
