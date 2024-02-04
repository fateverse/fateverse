package cn.fateverse.admin.dubbo;

import cn.fateverse.admin.vo.DeptVo;

import java.util.List;

/**
 * @author Clay
 * @date 2023-02-20
 */
public interface DubboDeptService {
    /**
     * 通过部门id获取到部门信息
     *
     * @param deptIds 部门列表
     * @return 返回部门信息
     */
    List<DeptVo> searchDeptByDeptId(List<Long> deptIds);
}
