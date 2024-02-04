package cn.fateverse.code.entity;

import cn.fateverse.common.core.annotaion.EnableAutoField;
import cn.fateverse.common.core.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * 校验规则表对象 gen_regula
 *
 * @author clay
 * @date 2023-05-27
 */
@Data
@Builder
@EnableAutoField
@AllArgsConstructor
@NoArgsConstructor
public class Regular extends BaseEntity{

    /**
     * id
     */
    private Long id;

    /**
     * 正则名称
     */
    private String name;

    /**
     * 正则内容
     */
    private String regular;

    /**
     * 验证内容
     */
    private String validation;

    /**
     * 是否启用 1:启动 2:关闭
     */
    private String enable;

}
