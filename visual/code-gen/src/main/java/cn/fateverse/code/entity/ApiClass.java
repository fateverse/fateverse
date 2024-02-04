package cn.fateverse.code.entity;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author Clay
 * @date 2022/11/15
 */
@Data
@ApiModel("接口类")
public class ApiClass {

    /**
     * 类id
     */
    @ApiModelProperty("类id")
    private String classId;
    /**
     * 模块id
     */
    @ApiModelProperty("模块id")
    private String moduleId;
    /**
     * 类名
     */
    @ApiModelProperty("类名")
    private String className;
    /**
     * 类描述
     */
    @ApiModelProperty("类描述")
    private String classDescribe;
    /**
     * 包名
     */
    @ApiModelProperty("包名")
    private String packageName;
    /**
     * 作者
     */
    @ApiModelProperty("作者")
    private String author;
    /**
     * 电子邮件
     */
    @ApiModelProperty("电子邮件")
    private String email;
    /**
     * 前缀
     */
    @ApiModelProperty("前缀")
    private String prefix;
}
