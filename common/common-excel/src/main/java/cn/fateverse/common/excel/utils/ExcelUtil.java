package cn.fateverse.common.excel.utils;

import cn.fateverse.common.excel.service.ExcelService;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.StrUtil;
import cn.fateverse.admin.vo.DictDataVo;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.utils.HttpServletUtils;
import cn.fateverse.common.core.utils.SpringContextHolder;
import cn.fateverse.common.core.annotaion.Excel;
import cn.fateverse.common.core.annotaion.Excels;
import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.support.ExcelTypeEnum;
import org.ehcache.impl.internal.concurrent.ConcurrentHashMap;
import org.springframework.util.ReflectionUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author Clay
 * @date 2022/12/19
 */
public class ExcelUtil {

    private static final Map<Class<?>, ExcelAssistWrapper> wrapperMap = new ConcurrentHashMap<>(8);

    private static Map<String, Map<String, DictDataVo>> dictDataMap;


    private static ExcelService getBean() {
        return SpringContextHolder.getBean(ExcelService.class);
    }

    /**
     * 获取到数据列表
     *
     * @param list
     * @return
     */
    private static List<List<Object>> getDataList(List<?> list, List<ExcelAssist> assistList) {
        return list.stream().map(object ->
                assistList.stream().map(assist -> {
                    Field field = assist.getField();
                    field.setAccessible(true);
                    Excel excel = assist.getExcel();
                    Object value = null;
                    if (StrUtil.isEmpty(assist.getObjectFieldName())) {
                        value = getData(object, excel, field);
                    } else {
                        Object sunValue = null;
                        try {
                            sunValue = ReflectionUtils.getField(field, object);
                        } catch (Exception e) {
                            return null;
                        }
                        if (null != sunValue) {
                            value = getData(object, excel, field);
                        }
                    }
                    return value;
                }).collect(Collectors.toList())
        ).collect(Collectors.toList());
    }

    /**
     * 获取到对象中的数据
     *
     * @param object
     * @param excel
     * @param field
     * @return
     */
    private static Object getData(Object object, Excel excel, Field field) {
        try {
            Object objectValue = ReflectionUtils.getField(field, object);
            if (objectValue instanceof Date) {
                objectValue = DateUtil.format((Date) objectValue, excel.dateFormat());
            }
            String dictType = excel.dictType();
            if (!StrUtil.isEmpty(dictType)) {
                Map<String, DictDataVo> dictMap = dictDataMap.get(dictType);
                if (null != dictMap) {
                    DictDataVo dictData = dictMap.get(objectValue.toString());
                    if (null != dictData) {
                        objectValue = dictData.getDictLabel();
                    }
                }
            }
            return objectValue;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 初始化header数据
     *
     * @param clazz
     * @param assist
     */
    private static void initHeader(Class<?> clazz, ExcelAssist assist, List<ExcelAssist> assistList) {
        for (Field field : clazz.getDeclaredFields()) {
            Excel excel = field.getAnnotation(Excel.class);
            if (null != excel) {
                assistList.add(new ExcelAssist(field, excel, assist));
            } else {
                Excels excels = field.getAnnotation(Excels.class);
                if (excels == null) {
                    continue;
                }
                Class<?> objectValue = field.getType();
                if (clazz == objectValue) {
                    throw new CustomException("不允许嵌套对象导出Excel");
                }
                ExcelAssist excelAssist = new ExcelAssist(field, excels);
                initHeader(objectValue, excelAssist, assistList);
            }
        }
    }

    public static void exportExcel(List<?> list, Class<?> clazz) {
        exportExcel(list, clazz, null);
    }

    /**
     * 导出数据Excel
     *
     * @param list
     * @param clazz
     * @param sheetName
     */
    public static void exportExcel(List<?> list, Class<?> clazz, String sheetName) {
        Set<String> dictList = new HashSet<>();

        ExcelAssistWrapper wrapper = wrapperMap.get(clazz);
        if (wrapper == null) {
            synchronized (wrapperMap) {
                wrapper = wrapperMap.get(clazz);
                if (wrapper == null) {
                    wrapper = new ExcelAssistWrapper();
                    List<ExcelAssist> assistList = new ArrayList<>();
                    initHeader(clazz, null, assistList);
                    List<List<String>> headerList = new ArrayList<>(assistList.size());
                    assistList = assistList.stream().sorted(Comparator.comparing(ExcelAssist::getOrder))
                            .peek(assist -> headerList.add(Collections.singletonList(assist.getExcel().value())))
                            .peek(assist -> {
                                String dictType = assist.getExcel().dictType();
                                if (!StrUtil.isEmpty(dictType)) {
                                    dictList.add(dictType);
                                }
                            })
                            .collect(Collectors.toList());

                    wrapper.assistList = assistList;
                    wrapper.headerList = headerList;
                    wrapperMap.put(clazz, wrapper);
                }
            }
        }


        if (dictList.size() > 0) {
            getDictData(new ArrayList<>(dictList));
        }
        List<List<Object>> dataList = getDataList(list, wrapper.assistList);
        try {
            sheetName = StrUtil.isEmpty(sheetName) ? "sheet" : sheetName;
            HttpServletResponse response = getResponse(sheetName);
            EasyExcel.write(response.getOutputStream())
                    .head(wrapper.headerList)
                    .excelType(ExcelTypeEnum.XLSX)
                    .sheet(StrUtil.isEmpty(sheetName) ? "sheet" : sheetName)
                    .doWrite(dataList);
        } catch (IOException e) {
            throw new CustomException("Excel导出失败!");
        }
    }


    private static HttpServletResponse getResponse(String sheetName) {
        HttpServletResponse response = HttpServletUtils.getResponse();
        response.setCharacterEncoding("utf-8");
        response.setContentType("multipart/form-data");
        response.setHeader("Content-Disposition",
                "attachment;fileName=" + sheetName + UUID.randomUUID() + ".xlsx");
        return response;
    }

    private static void getDictData(List<String> dictList) {
        ExcelService dictDataService = getBean();
        Map<String, Map<String, DictDataVo>> result = dictDataService.searchDictDataCacheKeys(dictList);
        if (null != result) {
            System.out.println(result.toString());
            dictDataMap = result;
        }
    }

    private static class ExcelAssistWrapper {
        private List<ExcelAssist> assistList;
        List<List<String>> headerList;
    }
}
