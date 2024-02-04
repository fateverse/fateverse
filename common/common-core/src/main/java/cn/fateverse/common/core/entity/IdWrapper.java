package cn.fateverse.common.core.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * @author Clay
 * @date 2023-11-14  21:11
 */
@Data
public class IdWrapper implements Serializable {

    private Long id;

    private List<Long> ids;

}
