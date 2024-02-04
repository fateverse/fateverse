package cn.fateverse.code.entity.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @author Clay
 * @date 2023-05-26
 */
@Data
public class ImportDto {

    @NotNull(message = "表格不能为空")
    private List<String> tables;

    @NotNull(message = "数据源id不能为空")
    private Long dataSourceId;
}
