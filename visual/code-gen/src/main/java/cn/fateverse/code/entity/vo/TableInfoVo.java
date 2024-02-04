package cn.fateverse.code.entity.vo;

import cn.fateverse.code.entity.OptionInfo;
import cn.fateverse.code.entity.Table;
import cn.fateverse.code.entity.TableColumn;
import cn.fateverse.common.core.entity.Option;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/18
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TableInfoVo {
    private List<Option> tableOption;
    private Table info;
    private OptionInfo optionInfo;
    private List<TableColumn> columns;
}
