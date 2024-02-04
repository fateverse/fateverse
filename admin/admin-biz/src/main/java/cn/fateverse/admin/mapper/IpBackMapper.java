package cn.fateverse.admin.mapper;

import cn.fateverse.admin.entity.IpBack;
import cn.fateverse.admin.query.IpBackQuery;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author Clay
 * @date 2023-10-22
 */
public interface IpBackMapper {

    /**
     * 查询ip黑名单列表
     *
     * @param query 查询对象
     * @return 查询结果
     */
    List<IpBack> selectList(IpBackQuery query);

    IpBack selectByIdaddr(String ipAddr);

    IpBack selectIpv4Count();

    /**
     * 根据id查询
     *
     * @param id id
     * @return ip黑名单
     */
    IpBack selectById(Long id);

    /**
     * 根据id查询
     *
     * @param ids id
     * @return ip黑名单
     */
    List<IpBack> selectByIds(List<Long> ids);

    /**
     * 新增数据
     *
     * @param ipBack ip黑名单
     * @return 执行结果
     */
    int insert(IpBack ipBack);

    /**
     * 更新数据
     *
     * @param ipBack ip黑名单
     * @return 执行结果
     */
    int update(IpBack ipBack);

    /**
     * 删除ip
     *
     * @param ids ip列表
     * @return 删除结果
     */
    int delete(List<Long> ids);

    List<IpBack> selectListStartEnd(@Param("start") int start, @Param("end") int end);
}
