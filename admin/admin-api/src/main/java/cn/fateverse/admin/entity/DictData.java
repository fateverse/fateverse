package cn.fateverse.admin.entity;

import cn.fateverse.admin.dto.DictDataDto;
import cn.fateverse.admin.vo.DictDataSimpVo;
import cn.fateverse.admin.vo.DictDataVo;
import cn.fateverse.common.core.annotaion.EnableAutoField;
import cn.fateverse.common.core.entity.BaseEntity;
import cn.fateverse.common.core.entity.Option;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.BeanUtils;

/**
 * @author Clay
 * @date 2022/11/9
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EnableAutoField
public class DictData extends BaseEntity {
    /**
     * 字典编码
     */
    private Long dictCode;
    /**
     * 字典排序
     */
    private Integer dictSort;
    /**
     * 字典标签
     */
    private String dictLabel;
    /**
     * 字典键值
     */
    private String dictValue;
    /**
     * 字典类型
     */
    private String dictType;
    /**
     * 样式属性（其他样式扩展）
     */
    private Boolean isType;
    /**
     * 表格回显样式
     */
    private String listClass;
    /**
     * 字典显示主题(ui框架时)or文字颜色(自定义颜色时)
     */
    private String theme;
    /**
     * 是否默认（Y是 N否）
     */
    private Integer isDefault;
    /**
     * 状态（1正常 0停用）
     */
    private String state;

    public static DictData toDictData(DictDataDto dto) {
        return DictData.builder()
                .dictCode(dto.getDictCode())
                .dictSort(dto.getDictSort())
                .dictLabel(dto.getDictLabel())
                .dictValue(dto.getDictValue())
                .dictType(dto.getDictType())
                .isType(dto.getIsType())
                .listClass(dto.getListClass())
                .theme(dto.getTheme())
                .isDefault(dto.getIsDefault())
                .state(dto.getState())
                .build();
    }

    public static DictDataVo toDictDataListVo(DictData dict) {
        return DictDataVo.builder()
                .dictCode(dict.getDictCode())
                .dictLabel(dict.getDictLabel())
                .dictSort(dict.getDictSort())
                .dictValue(dict.getDictValue())
                .dictType(dict.getDictType())
                .isDefault(dict.getIsDefault())
                .isType(dict.getIsType())
                .state(dict.getState())
                .listClass(dict.getListClass())
                .theme(dict.getTheme())
                .createTime(dict.getCreateTime())
                .build();
    }

    /**
     * 字典对象转换成为Option对象
     *
     * @param dictData 字典对象
     * @return Option选项
     */
    public static Option dictDataToOption(DictData dictData) {
        return Option.builder()
                .value(dictData.getDictValue())
                .label(dictData.getDictLabel())
                .build();
    }


    /**
     * 将DictData对象转换为DictDataVo对象
     *
     * @param dict 待转换的DictData对象
     * @return 转换后的DictDataVo对象
     */
    public static DictDataVo toDictDataVo(DictData dict) {
        DictDataVo dataVo = new DictDataVo();
        BeanUtils.copyProperties(dict, dataVo);
        return dataVo;
    }


    /**
     * 字典对象转换成为简单的字典返回Vo
     *
     * @param dictData 字典对象
     * @return 简单vo对象
     */
    public static DictDataSimpVo toDictDataSimpVo(DictData dictData) {
        return DictDataSimpVo.builder()
                .label(dictData.getDictLabel())
                .value(dictData.getDictValue())
                .isType(dictData.getIsType())
                .listClass(dictData.getListClass())
                .theme(dictData.getTheme())
                .isDefault(dictData.getIsDefault())
                .build();
    }

}
