package cn.fateverse.admin.entity;

import cn.fateverse.admin.vo.IpBackVo;
import cn.fateverse.common.core.annotaion.EnableAutoField;
import cn.fateverse.common.core.entity.BaseEntity;
import lombok.Data;

/**
 * @author Clay
 * @date 2023-10-22
 */
@Data
@EnableAutoField
public class IpBack extends BaseEntity {
    /**
     * 主键id
     */
    private Long id;
    /**
     * ip地址
     */
    private String ipAddr;
    /**
     * ip类型 ipv4 ipv6
     */
    private String type;

    public IpBackVo toIPBackVo(){
        return IpBackVo.builder()
                .id(id)
                .ipAddr(ipAddr)
                .type(type)
                .createTime(getCreateTime())
                .remark(getRemark())
                .build();
    }

}
