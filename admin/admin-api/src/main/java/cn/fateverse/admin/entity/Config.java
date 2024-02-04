package cn.fateverse.admin.entity;

import cn.fateverse.common.core.annotaion.EnableAutoField;
import cn.fateverse.common.core.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * 参数配置表对象 sys_config
 *
 * @author clay
 * @date 2023-06-09
*/
@Data
@Builder
@EnableAutoField
@AllArgsConstructor
@NoArgsConstructor
public class Config extends BaseEntity{

    /**
    * 参数主键
    */
    private Integer configId;

    /**
    * 参数名称
    */
    private String configName;

    /**
    * 参数键名
    */
    private String configKey;

    /**
    * 参数键值
    */
    private String configValue;

    /**
    * 系统内置（1是 0否）
    */
    private Integer configType;

}