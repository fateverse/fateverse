package cn.fateverse.common.core.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Clay
 * @date 2022/11/4
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Option {
    /**
     * 节点ID
     */
    private Object value;

    /**
     * 节点名称
     */
    private String label;
}
