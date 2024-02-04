package cn.fateverse.admin.dubbo;

import cn.fateverse.admin.service.DeptService;
import cn.fateverse.admin.vo.DeptVo;
import org.apache.dubbo.config.annotation.DubboService;

import java.util.List;

/**
 * @author Clay
 * @date 2023-02-20
 */
@DubboService
public class DubboDeptServiceImpl implements DubboDeptService {


    private final DeptService deptService;

    public DubboDeptServiceImpl(DeptService deptService) {
        this.deptService = deptService;
    }


    @Override
    public List<DeptVo> searchDeptByDeptId(List<Long> deptIds) {
        return deptService.searchByIds(deptIds);
    }
}
