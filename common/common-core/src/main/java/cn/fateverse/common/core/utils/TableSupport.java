package cn.fateverse.common.core.utils;

import cn.fateverse.common.core.entity.PageInfo;
import cn.hutool.core.convert.Convert;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * 表格数据处理
 *
 * @author Clay
 * @date 2022/10/30
 */
public class TableSupport {

    /**
     * 当前记录起始索引
     */
    public static final String PAGE_NUM = "pageNum";

    /**
     * 每页显示记录数
     */
    public static final String PAGE_SIZE = "pageSize";

    /**
     * 排序列
     */
    public static final String ORDER_BY_COLUMN = "orderByColumn";

    /**
     * 排序的方向 "desc" 或者 "asc".
     */
    public static final String IS_ASC = "isAsc";

    /**
     * 分页参数合理化
     */
    public static final String REASONABLE = "reasonable";

    /**
     * 封装分页对象
     */
    public static PageInfo getPageInfo() {
        PageInfo pageInfo = new PageInfo();
        pageInfo.setPageNum(Convert.toInt(getParameter(PAGE_NUM), 1));
        pageInfo.setPageSize(Convert.toInt(getParameter(PAGE_SIZE), 10));
        pageInfo.setOrderByColumn(getParameter(ORDER_BY_COLUMN));
        pageInfo.setIsAsc(getParameter(IS_ASC));
        pageInfo.setReasonable(getParameterToBool(REASONABLE));
        return pageInfo;
    }

    public static PageInfo buildPageRequest() {
        return getPageInfo();
    }

    /**
     * 获取Boolean参数
     */
    public static Boolean getParameterToBool(String name) {
        return Convert.toBool(getRequest().getParameter(name));
    }

    /**
     * 获取String参数
     */
    public static String getParameter(String name) {
        return Convert.toStr(getRequest().getParameter(name));
    }


    public static HttpServletRequest getRequest() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attributes.getRequest();
    }

}
