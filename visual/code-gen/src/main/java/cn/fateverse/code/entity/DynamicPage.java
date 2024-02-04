package cn.fateverse.code.entity;

import lombok.Builder;
import lombok.Data;

/**
 * @author Clay
 * @date 2023-07-29
 */
@Data
@Builder
public class DynamicPage {
    private Integer startNum;

    private Integer endNum;
}

