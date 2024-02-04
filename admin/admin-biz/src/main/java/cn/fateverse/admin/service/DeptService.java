package cn.fateverse.admin.service;

import cn.fateverse.admin.vo.DeptVo;
import cn.fateverse.admin.entity.Dept;
import cn.fateverse.common.core.entity.OptionTree;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/2
 */
public interface DeptService {

    /**
     * 查询部门树形结构数据
     *
     * @param deptName 部门名称
     * @param state 部门状态
     * @return 部门集合
     */
    List<DeptVo> searchTree(String deptName, Integer state);

    /**
     * 部门id查询部门信息
     *
     * @param deptId 部门id
     * @return 返回对象
     */
    DeptVo searchById(Long deptId);

    /**
     * 获取排除自身的部门树形结构
     *
     * @param deptId 部门id
     * @return 部门树形选择对象
     */
    List<OptionTree> searchExcludeTree(Long deptId);

    /**
     * 获取部门选择的树形结构
     *
     * @return 部门树形选择对象
     */
    List<OptionTree> searchTreeOption();

    /**
     * 通过ids获取到部门数据
     *
     * @param deptIds 部门id列表
     * @return 部门集合对象
     */
    List<DeptVo> searchByIds(List<Long> deptIds);

    /**
     * 校验部门名称是否唯一
     *
     * @param dept 部门对象
     * @return 结果
     */
    String checkNameUnique(Dept dept);

    /**
     * 是否存在部门子节点
     *
     * @param deptId 部门ID
     * @return 结果
     */
    boolean hasChildById(Long deptId);

    /**
     * 查询部门是否存在用户
     *
     * @param deptId 部门ID
     * @return 结果 true 存在 false 不存在
     */
    boolean checkExistUser(Long deptId);

    /**
     * 新增部门
     *
     * @param dept 部门对象
     * @return 影响条数
     */
    int save(Dept dept);

    /**
     * 更新部门信息
     *
     * @param dept 部门对象
     * @return 影响条数
     */
    int edit(Dept dept);

    /**
     * 删除部门
     *
     * @param deptId 部门id
     * @return 影响条数
     */
    int remove(Long deptId);
}
