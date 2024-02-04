package cn.fateverse.admin.mapper;

import cn.fateverse.admin.entity.Dept;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Set;

/**
 * @author Clay
 * @date 2022/11/2
 */
public interface DeptMapper {


    /**
     * 查询部门列表
     *
     * @param deptName 部门名称
     * @param state 部门状态
     * @return 部门集合
     */
    List<Dept> selectList(@Param("deptName") String deptName, @Param("state") Integer state);

    /**
     * 通过id查询部门信息
     *
     * @param deptId 部门id
     * @return 返回对象
     */
    Dept selectById(Long deptId);

    /**
     * 获取排除自身的部门列表
     *
     * @param deptId 部门id
     * @return 部门集合
     */
    List<Dept> selectExclude(Long deptId);

    /**
     * 查询所有的子节点
     *
     * @param deptId 部门id
     * @return 部门集合
     */
    List<Dept> selectChildrenById(Long deptId);

    /**
     * 校验部门名称是否唯一
     *
     * @param deptName 部门名称
     * @param parentId 父部门ID
     * @return 结果
     */
    Dept selectByDeptNameAndParentId(@Param("deptName") String deptName, @Param("parentId") Long parentId);

    /**
     * 根据父id查询部门信息
     * @param parentId 父级部门id
     * @return 部门集合
     */
    List<Dept> selectListByDeptParentId(Long parentId);


    /**
     * 通过parentId查询子列表
     *
     * @param parentId 父级id
     * @return 部门名称集合
     */
    Set<String> selectDeptNameListByParentId(Long parentId);

    /**
     * 查找是否存在子节点
     *
     * @param deptId 部门id
     * @return 数量
     */
    int selectChildCountByDeptId(Long deptId);

    /**
     * 查询部门是否存在用户
     *
     * @param deptId 部门id
     * @return 数量
     */
    int selectExistUserCount(Long deptId);

    /**
     * 根据ids获取到部门
     *
     * @param deptIds 部门id列表
     * @return 部门集合对象
     */
    List<Dept> selectByIds(List<Long> deptIds);

    /**
     * 新增部门
     *
     * @param dept 部门对象
     * @return 影响条数
     */
    int insert(Dept dept);

    /**
     * 更新部门信息
     *
     * @param dept 部门对象
     * @return 影响条数
     */
    int update(Dept dept);

    /**
     * 修改部门的状态;
     *
     * @param dept 部门对象
     * @return 影响条数
     */
    int updateState(Dept dept);

    /**
     * 批量修改子元素之前的关系
     *
     * @param depts 子元素
     * @return 结果
     */
    int updateChildren(@Param("depts") List<Dept> depts);

    /**
     * 删除部门
     *
     * @param deptId 部门id
     * @return 运行结构
     */
    int delete(Long deptId);
}
