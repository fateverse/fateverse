package cn.fateverse.admin.controller;

import cn.fateverse.admin.dto.DeptDto;
import cn.fateverse.admin.vo.DeptVo;
import cn.fateverse.admin.service.DeptService;
import cn.fateverse.common.core.constant.UserConstants;
import cn.fateverse.admin.entity.Dept;
import cn.fateverse.common.core.entity.OptionTree;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.result.Result;
import cn.fateverse.common.log.annotation.Log;
import cn.fateverse.common.log.enums.BusinessType;
import io.swagger.annotations.*;
import org.springframework.beans.BeanUtils;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/2
 */
@Api(tags = "部门接口")
@RestController
@RequestMapping("/dept")
public class DeptController {

    private final DeptService deptService;


    public DeptController(DeptService deptService) {
        this.deptService = deptService;
    }


    @ApiOperation("获取列表信息")
    @GetMapping
    @PreAuthorize("@ss.hasPermission('admin:dept:list')")
    public Result<List<DeptVo>> list(
            @ApiParam(name="deptName",value="部门名称") String deptName,
            @ApiParam(name="state",value="状态(1: 正常 0 : 停用)") Integer state){
        List<DeptVo> deptVoList = deptService.searchTree(deptName, state);
        return Result.ok(deptVoList);
    }

    @ApiOperation("获取部门详情")
    @GetMapping("/{deptId}")
    @PreAuthorize("@ss.hasPermission('admin:dept:info')")
    public Result<DeptVo> info(
            @ApiParam(name="deptId",value="部门id")
            @PathVariable Long deptId){
        checkDeptId(deptId);
        DeptVo deptVo = deptService.searchById(deptId);
        return Result.ok(deptVo);
    }

    @ApiOperation("获取树形接口的option")
    @GetMapping("/option")
    public Result<List<OptionTree>> option(){
        List<OptionTree> optionTreeList = deptService.searchTreeOption();
        return Result.ok(optionTreeList);
    }

    @ApiOperation("获取修改时的部门列表")
    @GetMapping("/option/exclude/{deptId}")
    public Result<List<OptionTree>> exclude(@PathVariable Long deptId){
        checkDeptId(deptId);
        List<OptionTree> deptVoList = deptService.searchExcludeTree(deptId);
        return Result.ok(deptVoList);
    }

    @ApiOperation("新增部门")
    @PostMapping
    @PreAuthorize("@ss.hasPermission('admin:dept:add')")
    @Log(title = "新增部门",businessType = BusinessType.INSERT)
    public Result<Void> add(@RequestBody @Validated DeptDto deptDto){
        Dept dept = new Dept();
        BeanUtils.copyProperties(deptDto,dept);
        if (UserConstants.DEPT_DISABLE.equals(deptService.checkNameUnique(dept))){
            return Result.error("新增部门: "+ dept.getDeptName() +"'失败,部门名称以存在!");
        }
        deptService.save(dept);
        return Result.ok();
    }

    @ApiOperation("修改部门")
    @PutMapping
    @PreAuthorize("@ss.hasPermission('admin:dept:edit')")
    @Log(title = "修改部门",businessType = BusinessType.UPDATE)
    public Result<Void> edit(@RequestBody @Validated DeptDto deptDto){
        Dept dept = new Dept();
        BeanUtils.copyProperties(deptDto,dept);
        if (UserConstants.DEPT_DISABLE.equals(deptService.checkNameUnique(dept))){
            return Result.error("修改部门: "+ dept.getDeptName() +"'失败,部门名称以存在!");
        }else if (dept.getDeptId().equals(dept.getParentId())){
            return Result.error("修改部门: "+ dept.getDeptName() +"'失败,上级部门不能为自己!");
        }
        checkDeptId(dept.getDeptId());
        deptService.edit(dept);
        return Result.ok();
    }


    @ApiOperation("删除部门")
    @DeleteMapping("/{deptId}")
    @PreAuthorize("@ss.hasPermission('admin:dept:del')")
    @Log(title = "删除部门",businessType = BusinessType.DELETE)
    public Result<Void> delete(@PathVariable Long deptId){
        checkDeptId(deptId);
        if (deptService.hasChildById(deptId)){
            return Result.error("存在下级部门,不允许删除");
        }else if (deptService.checkExistUser(deptId)){
            return Result.error("该部门下存在用户,不允许删除");
        }
        deptService.remove(deptId);
        return Result.ok();
    }


    /**
     * 检查部门id是都为空
     */
    private void checkDeptId(Long deptId){
        if (null == deptId){
            throw new CustomException("部门id不能为空!");
        }
    }




}
