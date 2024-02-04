package cn.fateverse.code.service;

import cn.fateverse.code.entity.dto.ImportDto;
import cn.fateverse.code.entity.dto.TableDto;
import cn.fateverse.code.entity.query.TableQuery;
import cn.fateverse.code.entity.vo.TableVo;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.core.result.page.TableDataInfo;

import java.util.List;
import java.util.Map;

/**
 * @author Clay
 * @date 2022/11/15
 */
public interface TableService {


    /**
     * 查询表信息
     *
     * @param query 表格查询
     * @return 表格数据信息
     */
    TableDataInfo<TableVo> searchList(TableQuery query);

    /**
     * 导出数据
     *
     * @param query 表格查询
     * @return 导出数据
     */
    List<TableVo> searchExport(TableQuery query);

    /**
     * 根据id查询到表的所有信息
     *
     * @param tableId
     * @return
     */
    TableDto searchByTableId(Long tableId);

    /**
     * 根据数据源id获取到对应的表,并组合成为option
     *
     * @param dataSourceId
     * @return
     */
    List<Option> searchOptionByDataSourceId(Long dataSourceId);

    /**
     * 预览代码
     *
     * @param tableId 表编号
     * @return 预览数据列表
     */
    Map<String, String> previewCode(Long tableId);

    /**
     * 下载代码
     *
     * @param tableId 表编号
     */
    void downloadCode(Long tableId);

    /**
     * 批量下载代码
     *
     * @param tableIds 表编号列表
     */
    void downloadCodeList(List<Long> tableIds);

    /**
     * 导入数据库表的源信息
     *
     * @param dto
     * @return
     */
    Result<Void> importTable(ImportDto dto);

    /**
     * 更新数据源信息
     *
     * @param table
     * @return
     */
    Result<Void> edit(TableDto table);

    /**
     * 同步数据库
     * @param tableId 同步数据库表
     */
    void syncTable(Long tableId);

    /**
     * 删除元数据
     *
     * @param tableId
     */
    void remove(Long tableId);

    /**
     * 批量删除元数据
     *
     * @param tableIds
     */
    void removeBatch(List<Long> tableIds);
}
