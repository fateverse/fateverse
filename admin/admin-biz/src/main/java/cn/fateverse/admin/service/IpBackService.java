package cn.fateverse.admin.service;

import cn.fateverse.admin.dto.IpBackDto;
import cn.fateverse.admin.query.IpBackQuery;
import cn.fateverse.admin.vo.IpBackVo;
import cn.fateverse.common.core.result.page.TableDataInfo;

import java.util.List;

/**
 * @author Clay
 * @date 2023-10-22
 */
public interface IpBackService {

    /**
     * 查询ip黑名单列表
     *
     * @param query 查询对象
     * @return 查询结果
     */
    TableDataInfo<IpBackVo> search(IpBackQuery query);

    /**
     * 校验ip是否为黑名单
     *
     * @param ipAddress 校验的ip地址
     * @return 结果
     */
    Boolean match(String ipAddress);

    /**
     * 根据id查询
     *
     * @param id id
     * @return ip黑名单
     */
    IpBackVo searchById(Long id);

    /**
     * 新增数据
     *
     * @param dto ip黑名单
     */
    void save(IpBackDto dto);

    /**
     * 更新数据
     *
     * @param dto ip黑名单
     */
    void edit(IpBackDto dto);

    /**
     * 删除ip
     *
     * @param ids ip列表
     */
    void delete(List<Long> ids);


    List<IpBackVo> exportList(IpBackQuery query);
}
