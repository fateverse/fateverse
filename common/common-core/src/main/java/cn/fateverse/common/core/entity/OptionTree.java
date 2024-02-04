package cn.fateverse.common.core.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * Treeselect树结构实体类
 *
 * @author Clay
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OptionTree implements Serializable {


    /**
     * 节点ID
     */
    private Object value;

    /**
     * 节点名称
     */
    private Object label;

    /**
     * 子节点
     */
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<OptionTree> children;
}
