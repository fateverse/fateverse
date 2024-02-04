package cn.fateverse.common.mybatisplus.utils;

import cn.fateverse.common.core.entity.PageInfo;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.TableSupport;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * @author Clay
 * @date 2023-05-25
 */
public class PageUtils {


    /**
     * 转换为TableDataInfo对象
     *
     * @param page 源对象
     * @param map  转换方法
     * @param <T>  转换后的对象类型
     * @param <R>  需要转换的对象类型
     * @return 转换后的对象
     */
    public static <T, R> TableDataInfo<T> convertDataTable(Page<R> page, Function<R, T> map) {
        List<T> convertList = page.getRecords().stream().map(map).collect(Collectors.toList());
        return convertDataTable(convertList, page.getTotal());
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

    public static <T> Page<T> getPage(){
        PageInfo pageInfo = TableSupport.getPageInfo();
        return new Page<>(pageInfo.getPageNum(), pageInfo.getPageSize());
    }
}
