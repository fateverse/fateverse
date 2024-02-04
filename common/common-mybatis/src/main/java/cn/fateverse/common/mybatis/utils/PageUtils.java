package cn.fateverse.common.mybatis.utils;

import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.ObjectUtils;
import cn.fateverse.common.core.utils.TableSupport;
import cn.fateverse.common.core.utils.sql.SqlUtil;
import cn.fateverse.common.core.entity.PageInfo;
import com.github.pagehelper.PageHelper;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 分页工具类
 *
 * @author Clay
 * @date 2022/10/30
 */
public class PageUtils extends PageHelper {

    /**
     * 设置请求分页
     */
    public static void startPage() {
        PageInfo pageInfo = TableSupport.buildPageRequest();
        Integer pageNum = pageInfo.getPageNum();
        Integer pageSize = pageInfo.getPageSize();
        String orderBy = SqlUtil.escapeOrderBySql(pageInfo.getOrderBy());
        Boolean reasonable = pageInfo.getReasonable();
        PageHelper.startPage(pageNum, pageSize, orderBy).setReasonable(reasonable);
    }

    /**
     * 开始的Size
     *
     * @param pageInfo
     * @return
     */
    public static Integer getStartSize(PageInfo pageInfo) {
        return (pageInfo.getPageNum() - 1) * pageInfo.getPageSize();
    }

    public static Integer getStartSize() {
        PageInfo pageInfo = TableSupport.buildPageRequest();
        return (pageInfo.getPageNum() - 1) * pageInfo.getPageSize();
    }

    /**
     * 获取到分页后的数据信息
     *
     * @param list
     * @param <T>
     * @return
     */
    public static <T> TableDataInfo<T> getDataTable(List<T> list) {
        if (null == list) {
            return new TableDataInfo<>(new ArrayList<>(), 0);
        }
        TableDataInfo<T> tableDataInfo = new TableDataInfo<>();
        tableDataInfo.setRows(list);
        tableDataInfo.setTotal(getTotal(list));
        return tableDataInfo;
    }

    /**
     * 获取到分页的总数
     *
     * @param list
     * @return
     */
    public static Long getTotal(List<?> list) {
        long total = new com.github.pagehelper.PageInfo<>(list).getTotal();
        clearPage();
        return total;
    }

    /**
     * 转换为TableDataInfo对象
     *
     * @param list
     * @param count
     * @param <T>
     * @return
     */
    public static <T> TableDataInfo<T> convertDataTable(List<T> list, Long count) {
        if (null == list) {
            return new TableDataInfo<>(new ArrayList<>(), 0);
        }
        TableDataInfo<T> tableDataInfo = new TableDataInfo<>();
        tableDataInfo.setRows(list);
        tableDataInfo.setTotal(count);
        return tableDataInfo;
    }

    /**
     * 转换为TableDataInfo对象
     *
     * @param list 源对象
     * @param map  转换方法
     * @param <T>  转换后的对象类型
     * @param <R>  需要转换的对象类型
     * @return 转换后的对象
     */
    public static <T, R> TableDataInfo<T> convertDataTable(List<R> list, Function<R, T> map) {
        Long total = PageUtils.getTotal(list);
        List<T> convertList = list.stream().filter(item -> !ObjectUtils.isEmpty(item)).map(map).collect(Collectors.toList());
        return convertDataTable(convertList, total);
    }


    /**
     * 清理分页的线程变量
     */
    public static void clearPage() {
        PageHelper.clearPage();
    }

}
