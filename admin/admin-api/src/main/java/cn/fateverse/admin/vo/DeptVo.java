package cn.fateverse.admin.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * @author Clay
 * @date 2022/11/2
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DeptVo implements Serializable {

    /**
     * 父部门名称
     */
    private Long parentId;

    /**
     * 部门ID
     */
    private Long deptId;

    /**
     * 部门名称
     */
    private String deptName;

    /**
     * 显示顺序
     */
    private String orderNum;

    /**
     * 负责人
     */
    private String leader;
    /**
     * 负责人Id
     */
    private Long leaderId;

    /**
     * 联系电话
     */
    private String phone;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 部门状态:1正常,0停用
     */
    private String state;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 子节点
     */
    private List<DeptVo> children;

}
