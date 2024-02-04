package cn.fateverse.code.entity;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author Clay
 * @date 2022/11/15
 */
@Data
@ApiModel("接口表")
public class InterTable {

    /**
     * id
     */
    @ApiModelProperty("id")
    private String interId;
    /**
     * 模块id
     */
    @ApiModelProperty("模块id")
    private String moduleId;
    /**
     * 类id
     */
    @ApiModelProperty("类id")
    private String classId;
    /**
     * 接口名称
     */
    @ApiModelProperty("接口名称")
    private String itName;
    /**
     * 描述
     */
    @ApiModelProperty("描述")
    private String itDescribe;
    /**
     * 是否设置许可
     */
    @ApiModelProperty("是否设置许可")
    private String isPermission;
    /**
     * 请求路径
     */
    @ApiModelProperty("请求路径")
    private String reqUrl;
    /**
     * 请求方式
     */
    @ApiModelProperty("请求方式")
    private String method;
    /**
     * 是否生成
     */
    @ApiModelProperty("是否生成")
    private String isGenerate;
    /**
     * 类型(1,工作台,2流程)
     */
    @ApiModelProperty("类型(1,工作台,2流程)")
    private String type;


}
