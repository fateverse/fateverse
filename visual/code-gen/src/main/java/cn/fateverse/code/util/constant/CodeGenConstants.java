package cn.fateverse.code.util.constant;

/**
 * 代码生成通用常量
 *
 * @author binlin
 */
public class CodeGenConstants {

    /**
     * 单表（增删改查）
     */
    public static final String TPL_CRUD = "crud";

    /**
     * 树表（增删改查）
     */
    public static final String TPL_TREE = "tree";

    /**
     * 主子表（增删改查）
     */
    public static final String TPL_SUB = "sub";

    /**
     * 关联查询（增删改查）
     */
    public static final String TPL_ASS = "ass";

    /**
     * 多表关联查询（增删改查）
     */
    public static final String TPL_REL = "rel";

    /**
     * 树编码字段
     */
    public static final String TREE_CODE = "treeCode";

    /**
     * 树父编码字段
     */
    public static final String TREE_PARENT_CODE = "treeParentCode";

    /**
     * 树名称字段
     */
    public static final String TREE_NAME = "treeName";

    /**
     * 上级菜单ID字段
     */
    public static final String PARENT_MENU_ID = "parentMenuId";

    /**
     * 上级菜单名称字段
     */
    public static final String PARENT_MENU_NAME = "parentMenuName";

    /**
     * 页面不需要编辑新增字段
     */
    public static final String[] COLUMN_NAME_NOT_EDIT_INSERT = {"id", "create_by", "create_time", "del_flag", "update_by",
            "update_time"};

    /**
     * 页面不需要显示的列表字段
     */
    public static final String[] COLUMN_NAME_NOT_LIST = {"id", "create_by", "create_time", "del_flag", "update_by",
            "update_time"};

    /**
     * 页面不需要查询字段
     */
    public static final String[] COLUMN_NAME_NOT_QUERY = {"id", "create_by", "create_time", "del_flag", "update_by",
            "update_time", "remark"};

    /**
     * Entity基类字段
     */
    public static final String[] BASE_ENTITY = {"createBy", "createTime", "updateBy", "updateTime", "remark"};

    /**
     * 创建人
     */
    public static final String CREATE_BY_FIELD = "createBy";

    /**
     * 创建时间
     */
    public static final String CREATE_TIME_FIELD = "createTime";

    /**
     * 更新人
     */
    public static final String UPDATE_BY_FIELD = "updateBy";

    /**
     * 更新时间
     */
    public static final String UPDATE_TIME_FIELD = "updateTime";

    /**
     * Tree基类字段
     */
    public static final String[] TREE_ENTITY = {"parentName", "parentId", "orderNum", "ancestors", "children"};

    /**
     * 文本框
     */
    public static final String HTML_INPUT = "input";

    /**
     * 文本域
     */
    public static final String HTML_TEXTAREA = "textarea";

    /**
     * 下拉框
     */
    public static final String HTML_SELECT = "select";

    /**
     * 单选框
     */
    public static final String HTML_RADIO = "radio";

    /**
     * 复选框
     */
    public static final String HTML_CHECKBOX = "checkbox";

    /**
     * 日期控件
     */
    public static final String HTML_DATETIME = "datetime";

    /**
     * 图片上传控件
     */
    public static final String HTML_IMAGE_UPLOAD = "imageUpload";

    /**
     * 文件上传控件
     */
    public static final String HTML_FILE_UPLOAD = "fileUpload";

    /**
     * 富文本控件
     */
    public static final String HTML_EDITOR = "editor";

    /**
     * 字符串类型
     */
    public static final String TYPE_STRING = "String";

    /**
     * 整型
     */
    public static final String TYPE_INTEGER = "Integer";

    /**
     * 长整型
     */
    public static final String TYPE_LONG = "Long";

    /**
     * 浮点型
     */
    public static final String TYPE_DOUBLE = "Double";

    /**
     * 高精度计算类型
     */
    public static final String TYPE_BIG_DECIMAL = "BigDecimal";

    /**
     * 时间类型
     */
    public static final String TYPE_DATE = "Date";

    /**
     * 模糊查询
     */
    public static final String QUERY_LIKE = "LIKE";

    /**
     * 精确查询
     */
    public static final String QUERY_EQ = "EQ";

    /**
     * 需要
     */
    public static final String REQUIRE = "1";

    /**
     * 不需要
     */
    public static final String NO_REQUIRE = "0";

    /**
     * 不需要 int类型
     */
    public static final Integer NO_REQUIRE_INTEGER = 0;

    /**
     * 自定义路径
     */
    public static final String CUSTOM_PATHS = "1";

    /**
     * zip压缩包
     */
    public static final String ZIP_COMPRESSED_PACKAGE = "0";

    /**
     * 前缀 name
     */
    public static final String NAME_SUFFIX = "name";
    /**
     * 前缀 state
     */
    public static final String STATE_SUFFIX = "state";
    /**
     * 前缀 type
     */
    public static final String TYPE_SUFFIX = "type";
    /**
     * 前缀 sex
     */
    public static final String SEX_SUFFIX = "sex";
    /**
     * 前缀 image
     */
    public static final String IMAGE_SUFFIX = "image";
    /**
     * 前缀 file
     */
    public static final String FILE_SUFFIX = "file";
    /**
     * 前缀 content
     */
    public static final String CONTENT_SUFFIX = "content";
}
