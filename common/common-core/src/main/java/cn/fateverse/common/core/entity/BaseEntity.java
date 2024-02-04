package cn.fateverse.common.core.entity;

import cn.fateverse.common.core.annotaion.AutoTime;
import cn.fateverse.common.core.annotaion.AutoUser;
import cn.fateverse.common.core.enums.MethodEnum;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.io.Serializable;
import java.util.Date;

/**
 * @author Clay
 * @date 2022/10/30
 */
public class BaseEntity implements Serializable {

    /**
     * 创建者
     */
    @AutoUser(method = MethodEnum.INSERT)
    private Object createBy;

    /**
     * 创建时间
     */
    @AutoTime(method = MethodEnum.INSERT)
    @JsonFormat(locale = "zh",timezone = "GMT+8",pattern = "yyyy-MM-dd")
    private Date createTime;

    /**
     * 更新者
     */
    @AutoUser(method = MethodEnum.UPDATE)
    private Object updateBy;

    /**
     * 更新时间
     */
    @AutoTime(method = MethodEnum.UPDATE)
    @JsonFormat(locale = "zh",timezone = "GMT+8",pattern = "yyyy-MM-dd")
    private Date updateTime;


    /**
     * 备注信息
     */
    private String remark;


    public Object getCreateBy() {
        return createBy;
    }

    public void setCreateBy(Object createBy) {
        this.createBy = createBy;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Object getUpdateBy() {
        return updateBy;
    }

    public void setUpdateBy(Object updateBy) {
        this.updateBy = updateBy;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
