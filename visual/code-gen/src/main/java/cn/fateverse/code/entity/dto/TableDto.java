package cn.fateverse.code.entity.dto;

import cn.fateverse.code.entity.OptionInfo;
import cn.fateverse.code.entity.Table;
import cn.fateverse.code.entity.TableColumn;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/15
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TableDto extends Table {
    private List<TableColumn> columns;


    private OptionInfo optionInfo;

}
