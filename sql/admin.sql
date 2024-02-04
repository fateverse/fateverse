/*
 Navicat Premium Data Transfer

 Source Server         : fateverse-demo
 Source Server Type    : MySQL
 Source Server Version : 80036
 Source Schema         : fateverse_admin

 Target Server Type    : MySQL
 Target Server Version : 80036
 File Encoding         : 65001

 Date: 01/02/2024 16:12:58
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_config
-- ----------------------------
DROP TABLE IF EXISTS `sys_config`;
CREATE TABLE `sys_config`  (
  `config_id` int NOT NULL AUTO_INCREMENT COMMENT '参数主键',
  `config_name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '参数名称',
  `config_key` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '参数键名',
  `config_value` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '参数键值',
  `config_type` int NULL DEFAULT 0 COMMENT '系统内置（1是 0否）',
  `create_by` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`config_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '参数配置表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_config
-- ----------------------------
INSERT INTO `sys_config` VALUES (1, 'varchar', 'varchar', '', 1, 'admin', '2023-06-09 18:29:53', NULL, NULL, NULL);

-- ----------------------------
-- Table structure for sys_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_dept`;
CREATE TABLE `sys_dept`  (
  `dept_id` bigint NOT NULL AUTO_INCREMENT COMMENT '部门id',
  `parent_id` bigint NULL DEFAULT 0 COMMENT '父部门id',
  `ancestors` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '祖级列表',
  `dept_name` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '部门名称',
  `order_num` int NULL DEFAULT 0 COMMENT '显示顺序',
  `leader` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '负责人',
  `leader_id` int NULL DEFAULT NULL COMMENT '负责人id',
  `phone` varchar(11) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '联系电话',
  `email` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `state` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '0' COMMENT '部门状态（0正常 1停用）',
  `del_flag` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `create_by` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`dept_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 136 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '部门表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_dept
-- ----------------------------
INSERT INTO `sys_dept` VALUES (100, 0, '0', 'FateVerse', 0, 'clay', 1, '15888888888', 'ebts@qq.com', '1', '0', '0', '2018-03-16 11:33:00', '0', '2024-02-01 11:24:22');
INSERT INTO `sys_dept` VALUES (101, 100, '0,100', '一分部', 1, 'clay', 2, '15888888888', 'ebts@qq.com', '1', '0', '0', '2018-03-16 11:33:00', '0', '2022-11-14 14:18:15');
INSERT INTO `sys_dept` VALUES (102, 100, '0,100', '二分部', 2, 'clay', 1, '15888888888', 'ebts@qq.com', '1', '0', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00');
INSERT INTO `sys_dept` VALUES (103, 101, '0,100,101', '研发部门', 1, 'clay', 3, '15888888888', 'ebts@qq.com', '1', '0', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00');
INSERT INTO `sys_dept` VALUES (104, 101, '0,100,101', '市场部门', 2, 'clay', 1, '15888888888', 'ebts@qq.com', '1', '0', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00');
INSERT INTO `sys_dept` VALUES (105, 101, '0,100,101', '测试部门', 3, 'clay', 4, '15888888888', 'ebts@qq.com', '1', '0', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00');
INSERT INTO `sys_dept` VALUES (106, 101, '0,100,101', '财务部门', 4, 'clay', 1, '15888888888', 'ebts@qq.com', '1', '0', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00');
INSERT INTO `sys_dept` VALUES (107, 101, '0,100,101', '运维部门', 5, 'clay', 1, '15888888888', 'ebts@qq.com', '1', '0', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00');
INSERT INTO `sys_dept` VALUES (108, 102, '0,100,102', '市场部门', 1, 'clay', 1, '15888888888', 'ebts@qq.com', '1', '0', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00');
INSERT INTO `sys_dept` VALUES (109, 102, '0,100,102', '财务部门', 2, 'clay', 1, '15888888888', 'ebts@qq.com', '1', '0', '0', '2018-03-16 11:33:00', '0', '2022-11-24 13:29:26');

-- ----------------------------
-- Table structure for sys_dict_data
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict_data`;
CREATE TABLE `sys_dict_data`  (
  `dict_code` bigint NOT NULL AUTO_INCREMENT COMMENT '字典编码',
  `dict_sort` int NULL DEFAULT 0 COMMENT '字典排序',
  `dict_label` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '字典标签',
  `dict_value` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '' COMMENT '字典键值',
  `dict_type` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '字典类型',
  `is_type` int NULL DEFAULT NULL COMMENT '是否为内置样式或者自定义颜色 0 : 自定义颜色 1 : 内置类型',
  `list_class` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '表格回显样式',
  `theme` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '字典显示主题(ui框架时)or文字颜色(自定义颜色时)',
  `is_default` int NULL DEFAULT 0 COMMENT '是否默认（Y是 N否）',
  `state` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '1' COMMENT '状态（1正常 0停用）',
  `create_by` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`dict_code`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 183 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '字典数据表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_dict_data
-- ----------------------------
INSERT INTO `sys_dict_data` VALUES (1, 1, '男', '0', 'user_sex', 1, 'primary', 'plain', 1, '1', '0', '2022-12-02 16:17:32', NULL, '2023-11-03 17:24:28', '性别男');
INSERT INTO `sys_dict_data` VALUES (2, 2, '女', '1', 'user_sex', 1, 'warning', 'plain', 0, '1', '0', '2022-12-02 16:17:32', NULL, '2023-11-03 17:25:58', '性别女');
INSERT INTO `sys_dict_data` VALUES (3, 3, '未知', '2', 'user_sex', 1, 'info', 'plain', 0, '1', '0', '2022-12-02 16:17:32', NULL, '2023-11-03 17:26:01', '性别未知');
INSERT INTO `sys_dict_data` VALUES (4, 1, '显示', '1', 'show_hide', 1, 'primary', 'plain', 1, '1', '0', '2022-12-02 16:17:32', 'admin', '2023-11-03 17:25:20', '显示菜单');
INSERT INTO `sys_dict_data` VALUES (5, 2, '隐藏', '0', 'show_hide', 1, 'danger', 'plain', 0, '1', '0', '2022-12-02 16:17:32', NULL, '2023-11-03 17:25:23', '隐藏菜单');
INSERT INTO `sys_dict_data` VALUES (6, 1, '正常', '1', 'normal_disable', 1, 'primary', 'plain', 1, '1', '0', '2022-12-02 16:17:32', 'admin', '2023-11-02 23:47:47', '正常状态');
INSERT INTO `sys_dict_data` VALUES (7, 2, '停用', '0', 'normal_disable', 1, 'danger', 'plain', 0, '1', '0', '2022-12-02 16:17:32', 'admin', '2023-11-02 23:47:52', '停用状态');
INSERT INTO `sys_dict_data` VALUES (8, 1, '正常', '1', 'job_status', 1, 'primary', 'plain', 1, '1', '0', '2022-12-02 16:17:32', NULL, '2023-11-03 17:25:28', '正常状态');
INSERT INTO `sys_dict_data` VALUES (9, 2, '暂停', '0', 'job_status', 1, 'danger', 'plain', 0, '1', '0', '2022-12-02 16:17:32', NULL, '2023-11-03 17:25:31', '停用状态');
INSERT INTO `sys_dict_data` VALUES (10, 1, '默认', 'DEFAULT', 'job_group', 1, '', 'plain', 1, '1', '0', '2022-12-02 16:17:32', NULL, '2023-11-03 17:25:35', '默认分组');
INSERT INTO `sys_dict_data` VALUES (11, 2, '系统', 'SYSTEM', 'job_group', 1, 'warning', 'plain', 0, '1', 'admin', '2022-12-02 16:17:32', NULL, '2023-11-03 17:25:49', '系统分组');
INSERT INTO `sys_dict_data` VALUES (12, 1, '是', '1', 'yes_no', 1, 'primary', 'plain', 1, '1', 'admin', '2022-12-02 16:17:32', 'admin', '2023-11-03 17:26:10', '系统默认是');
INSERT INTO `sys_dict_data` VALUES (13, 2, '否', '0', 'yes_no', 1, 'danger', 'plain', 0, '1', 'admin', '2022-12-02 16:17:32', 'admin', '2023-11-03 17:26:13', '系统默认否');
INSERT INTO `sys_dict_data` VALUES (14, 1, '通知', '1', 'notice_type', 1, 'primary', 'plain', 1, '1', 'admin', '2022-12-02 16:17:32', NULL, '2023-11-03 17:26:17', '通知');
INSERT INTO `sys_dict_data` VALUES (15, 2, '公告', '2', 'notice_type', 1, 'success', 'plain', 0, '1', 'admin', '2022-12-02 16:17:32', NULL, '2023-11-03 17:26:20', '公告');
INSERT INTO `sys_dict_data` VALUES (16, 1, '正常', '0', 'notice_state', 1, 'primary', 'plain', 1, '1', 'admin', '2022-12-02 16:17:32', NULL, '2023-11-03 17:26:24', '正常状态');
INSERT INTO `sys_dict_data` VALUES (17, 2, '关闭', '1', 'notice_state', 1, 'danger', 'plain', 0, '1', 'admin', '2022-12-02 16:17:32', NULL, '2023-11-03 17:26:27', '关闭状态');
INSERT INTO `sys_dict_data` VALUES (18, 1, '新增', '1', 'oper_type', 1, 'success', 'light', 0, '1', 'admin', '2022-12-02 16:17:32', NULL, '2023-11-02 23:23:01', '新增操作');
INSERT INTO `sys_dict_data` VALUES (19, 2, '修改', '2', 'oper_type', 1, 'info', NULL, 0, '1', 'admin', '2022-12-02 16:17:32', NULL, NULL, '修改操作');
INSERT INTO `sys_dict_data` VALUES (20, 3, '删除', '3', 'oper_type', 1, 'danger', NULL, 0, '1', 'admin', '2022-12-02 16:17:32', NULL, NULL, '删除操作');
INSERT INTO `sys_dict_data` VALUES (21, 4, '授权', '4', 'oper_type', 1, 'primary', NULL, 0, '1', 'admin', '2022-12-02 16:17:32', NULL, NULL, '授权操作');
INSERT INTO `sys_dict_data` VALUES (22, 5, '导出', '5', 'oper_type', 1, 'warning', NULL, 0, '1', 'admin', '2022-12-02 16:17:32', NULL, NULL, '导出操作');
INSERT INTO `sys_dict_data` VALUES (23, 6, '导入', '6', 'oper_type', 1, 'warning', NULL, 0, '1', 'admin', '2022-12-02 16:17:32', NULL, NULL, '导入操作');
INSERT INTO `sys_dict_data` VALUES (24, 7, '强退', '7', 'oper_type', 1, 'danger', NULL, 0, '1', 'admin', '2022-12-02 16:17:32', NULL, NULL, '强退操作');
INSERT INTO `sys_dict_data` VALUES (25, 8, '生成代码', '8', 'oper_type', 1, 'warning', NULL, 0, '1', 'admin', '2022-12-02 16:17:32', NULL, NULL, '生成操作');
INSERT INTO `sys_dict_data` VALUES (26, 9, '清空数据', '9', 'oper_type', 1, 'danger', NULL, 0, '1', 'admin', '2022-12-02 16:17:32', NULL, NULL, '清空操作');
INSERT INTO `sys_dict_data` VALUES (27, 1, '成功', '0', 'common_state', 1, 'primary', NULL, 0, '1', 'admin', '2022-12-02 16:17:32', NULL, '2023-11-03 00:20:27', '正常状态');
INSERT INTO `sys_dict_data` VALUES (28, 2, '失败', '1', 'common_state', 1, 'danger', NULL, 0, '1', 'admin', '2022-12-02 16:17:32', NULL, '2023-11-03 00:20:32', '停用状态');
INSERT INTO `sys_dict_data` VALUES (100, 1, '开启', '1', 'regular_enable', 1, 'primary', 'plain', 0, '1', 'admin', '2022-12-02 16:17:32', NULL, '2023-11-02 23:49:02', NULL);
INSERT INTO `sys_dict_data` VALUES (101, 2, '关闭', '0', 'regular_enable', 1, 'danger', 'plain', 0, '1', 'admin', '2022-12-02 16:17:32', NULL, '2023-11-02 23:48:58', NULL);
INSERT INTO `sys_dict_data` VALUES (102, 1, '公开', '1', 'file_public', 1, NULL, NULL, 0, '1', 'admin', '2022-12-02 16:17:32', NULL, NULL, '文件默认值,公开');
INSERT INTO `sys_dict_data` VALUES (103, 2, '保护', '2', 'file_public', 1, NULL, NULL, 0, '1', 'admin', '2022-12-02 16:17:32', NULL, NULL, '文件是受保护的');
INSERT INTO `sys_dict_data` VALUES (104, 0, 'xls', 'xls', 'fIle_type', 1, NULL, NULL, 0, '1', 'admin', '2022-12-02 16:17:32', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (105, 0, 'doc', 'doc', 'fIle_type', 1, NULL, NULL, 0, '1', 'admin', '2022-12-02 16:17:32', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (106, 0, 'docx', 'docx', 'fIle_type', 1, NULL, NULL, 0, '1', 'admin', '2022-12-02 16:17:32', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (107, 0, 'xlsx', 'xlsx', 'fIle_type', 1, NULL, NULL, 0, '1', 'admin', '2022-12-02 16:17:32', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (108, 0, 'jpg', 'jpg', 'fIle_type', 1, NULL, NULL, 0, '1', 'admin', '2022-12-02 16:17:32', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (109, 0, 'png', 'png', 'fIle_type', 1, NULL, NULL, 0, '1', 'admin', '2022-12-02 16:17:32', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (142, 0, 'Java', 'JAVA', 'data_adapterT_type', NULL, 'primary', NULL, 0, '1', NULL, '2023-10-29 19:04:25', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (143, 0, 'JavaScript', 'JAVA_SCRIPT', 'data_adapterT_type', 1, 'success', NULL, 0, '1', NULL, '2023-10-29 19:04:41', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (149, 0, 'Java', 'JAVA', 'data_adapter_type', 1, 'primary', NULL, 0, '1', NULL, '2023-10-29 23:23:38', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (150, 0, 'JavaScript', 'JAVA_SCRIPT', 'data_adapter_type', 1, 'primary', NULL, 0, '1', NULL, '2023-10-29 23:23:50', NULL, '2023-10-29 23:24:36', NULL);
INSERT INTO `sys_dict_data` VALUES (151, 0, '富文本', 'html', 'content_type', 1, 'success', 'light', 0, '1', NULL, '2023-11-02 23:14:09', NULL, '2023-11-02 23:19:36', NULL);
INSERT INTO `sys_dict_data` VALUES (152, 0, '文本', 'text', 'content_type', 1, 'info', 'light', 0, '1', NULL, '2023-11-02 23:14:45', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (153, 0, '已发布', 'true', 'publish_type', 1, 'success', 'light', 0, '1', NULL, '2023-11-02 23:43:46', NULL, '2023-11-03 15:06:48', NULL);
INSERT INTO `sys_dict_data` VALUES (154, 0, '未发布', 'false', 'publish_type', 1, 'primary', 'light', 0, '1', NULL, '2023-11-02 23:43:57', NULL, '2023-11-03 15:07:01', NULL);
INSERT INTO `sys_dict_data` VALUES (155, 0, '主机', '1', 'data_source_config', 1, 'primary', 'light', 0, '1', NULL, '2023-11-03 16:49:55', NULL, '2023-11-03 16:50:21', NULL);
INSERT INTO `sys_dict_data` VALUES (156, 0, 'JDBC', '2', 'data_source_config', 1, 'warning', 'light', 0, '1', NULL, '2023-11-03 16:50:10', NULL, '2023-11-03 17:16:58', NULL);
INSERT INTO `sys_dict_data` VALUES (157, 0, '未读', '0', 'read_state', 1, 'primary', 'light', 0, '1', NULL, '2023-11-03 17:20:27', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (158, 0, '已读', '1', 'read_state', 1, 'warning', 'light', 0, '1', NULL, '2023-11-03 17:20:47', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (159, 0, '文本类型', 'text', 'display_type', 1, 'primary', 'light', 0, '1', NULL, '2023-11-14 21:01:52', NULL, '2023-11-14 21:02:28', NULL);
INSERT INTO `sys_dict_data` VALUES (160, 0, '图片', 'image', 'display_type', 1, 'primary', 'light', 0, '1', NULL, '2023-11-14 21:02:07', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (161, 0, '时间', 'date', 'display_type', 1, 'primary', 'light', 0, '1', NULL, '2023-11-14 21:02:22', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (162, 0, '超文本标签', 'html', 'display_type', 1, 'primary', 'light', 0, '1', NULL, '2023-11-14 21:02:52', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (163, 0, '字典', 'dict', 'display_type', 1, 'primary', 'light', 0, '1', NULL, '2023-11-14 21:03:10', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (164, 0, 'YYYY', 'yyyy', 'date_format', 1, 'primary', 'light', 0, '1', NULL, '2023-11-14 22:15:16', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (165, 0, 'YYYY_MM', 'yyyy-MM', 'date_format', 1, 'primary', 'light', 0, '1', NULL, '2023-11-14 22:15:28', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (166, 0, 'YYYY_MM_DD', 'yyyy-MM-dd', 'date_format', 1, 'primary', 'light', 0, '1', NULL, '2023-11-14 22:15:42', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (167, 0, 'YYYYMMDDHHMMSS', 'yyyyMMddHHmmss', 'date_format', 1, 'primary', 'light', 0, '1', NULL, '2023-11-14 22:15:54', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (168, 0, 'YYYY_MM_DD_HH_MM_SS', 'yyyy-MM-dd HH:mm:ss', 'date_format', 1, 'primary', 'light', 0, '1', NULL, '2023-11-14 22:16:08', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (169, 0, '是', 'true', 'outside_chain1', 1, 'primary', 'light', 0, '1', NULL, '2023-11-17 21:09:02', NULL, '2023-11-17 21:09:21', NULL);
INSERT INTO `sys_dict_data` VALUES (170, 0, '否', 'false', 'outside_chain1', 1, 'warning', 'light', 0, '1', NULL, '2023-11-17 21:09:18', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (171, 0, '是', '1', 'outside_chain', 1, 'primary', 'light', 0, '1', NULL, '2023-11-17 21:17:26', NULL, '2023-11-17 21:31:45', NULL);
INSERT INTO `sys_dict_data` VALUES (172, 0, '否', '0', 'outside_chain', 1, 'warning', 'light', 0, '1', NULL, '2023-11-17 21:17:37', NULL, '2023-11-17 21:31:48', NULL);
INSERT INTO `sys_dict_data` VALUES (173, 0, '缓存', '1', 'is_cache', 1, 'primary', 'light', 0, '1', NULL, '2023-11-17 21:18:04', NULL, '2023-11-17 21:31:53', NULL);
INSERT INTO `sys_dict_data` VALUES (174, 0, '不缓存', '0', 'is_cache', 1, 'warning', 'light', 0, '1', NULL, '2023-11-17 21:18:18', NULL, '2023-11-17 21:31:56', NULL);
INSERT INTO `sys_dict_data` VALUES (175, 0, '目录', 'D', 'menu_type', 1, 'primary', 'light', 0, '1', NULL, '2023-11-17 21:20:23', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (176, 0, '菜单', 'M', 'menu_type', 1, 'warning', 'light', 0, '1', NULL, '2023-11-17 21:20:40', NULL, NULL, NULL);
INSERT INTO `sys_dict_data` VALUES (177, 0, '按钮', 'B', 'menu_type', 1, 'success', 'light', 0, '1', NULL, '2023-11-17 21:20:53', NULL, '2023-11-17 21:20:57', NULL);
INSERT INTO `sys_dict_data` VALUES (178, 0, '是', '1', 'is_frame', 1, 'primary', 'light', 0, '1', NULL, '2023-11-17 21:34:03', NULL, '2023-12-19 22:40:06', NULL);
INSERT INTO `sys_dict_data` VALUES (179, 0, '否', '0', 'is_frame', 1, 'warning', 'light', 0, '1', NULL, '2023-11-17 21:34:11', NULL, '2023-12-19 22:40:17', NULL);
INSERT INTO `sys_dict_data` VALUES (182, 0, '测试', '3', 'user_sex', 1, 'primary', 'dark', 0, '1', NULL, '2024-02-01 16:05:26', NULL, NULL, NULL);

-- ----------------------------
-- Table structure for sys_dict_type
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict_type`;
CREATE TABLE `sys_dict_type`  (
  `dict_id` bigint NOT NULL AUTO_INCREMENT COMMENT '字典主键',
  `dict_name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '字典名称',
  `dict_type` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '字典类型',
  `state` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '0' COMMENT '状态（1正常 0停用）',
  `create_by` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`dict_id`) USING BTREE,
  UNIQUE INDEX `dict_type`(`dict_type` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 135 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '字典类型表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_dict_type
-- ----------------------------
INSERT INTO `sys_dict_type` VALUES (1, '用户性别', 'user_sex', '1', 'admin', '2018-03-16 11:33:00', NULL, NULL, '用户性别列表');
INSERT INTO `sys_dict_type` VALUES (2, '是否展示', 'show_hide', '1', 'admin', '2018-03-16 11:33:00', NULL, '2023-10-29 19:07:47', '菜单状态列表');
INSERT INTO `sys_dict_type` VALUES (3, '系统开关', 'normal_disable', '1', 'admin', '2018-03-16 11:33:00', NULL, NULL, '系统开关列表');
INSERT INTO `sys_dict_type` VALUES (4, 'job_status', 'job_status', '1', 'admin', '2018-03-16 11:33:00', NULL, NULL, '任务状态列表');
INSERT INTO `sys_dict_type` VALUES (5, '任务分组', 'job_group', '1', 'admin', '2018-03-16 11:33:00', NULL, NULL, '任务分组列表');
INSERT INTO `sys_dict_type` VALUES (6, '系统是否', 'yes_no', '1', 'admin', '2018-03-16 11:33:00', NULL, NULL, '系统是否列表');
INSERT INTO `sys_dict_type` VALUES (7, '通知类型', 'notice_type', '1', 'admin', '2018-03-16 11:33:00', NULL, NULL, '通知类型列表');
INSERT INTO `sys_dict_type` VALUES (8, '通知状态', 'notice_state', '1', 'admin', '2018-03-16 11:33:00', NULL, NULL, '通知状态列表');
INSERT INTO `sys_dict_type` VALUES (9, '操作类型', 'oper_type', '1', 'admin', '2018-03-16 11:33:00', 'admin', '2023-11-02 23:19:59', '操作类型列表11111');
INSERT INTO `sys_dict_type` VALUES (10, '是否成功', 'common_state', '1', 'admin', '2018-03-16 11:33:00', NULL, '2023-11-03 00:19:17', '登录状态列表');
INSERT INTO `sys_dict_type` VALUES (12, '正则验证开关', 'regular_enable', '1', 'admin', '2021-01-18 15:30:48', NULL, NULL, NULL);
INSERT INTO `sys_dict_type` VALUES (13, '是否公开', 'file_public', '1', 'admin', '2021-02-17 14:17:38', NULL, NULL, '文件管理');
INSERT INTO `sys_dict_type` VALUES (14, '上传文件类型', 'fIle_type', '1', 'admin', '2021-02-17 15:12:07', NULL, NULL, NULL);
INSERT INTO `sys_dict_type` VALUES (15, '数据源配置类型', 'data_source_config', '0', NULL, '2023-10-21 22:45:40', NULL, NULL, NULL);
INSERT INTO `sys_dict_type` VALUES (16, '适配器代码类型', 'data_adapter_type', '0', NULL, '2023-10-29 19:03:54', NULL, '2023-10-29 22:37:20', NULL);
INSERT INTO `sys_dict_type` VALUES (17, '文本类型', 'content_type', '1', NULL, '2023-11-02 23:13:55', NULL, NULL, NULL);
INSERT INTO `sys_dict_type` VALUES (18, '发布类型', 'publish_type', '1', NULL, '2023-11-02 23:43:25', NULL, NULL, NULL);
INSERT INTO `sys_dict_type` VALUES (19, '阅读状态', 'read_state', '1', NULL, '2023-11-03 17:20:01', NULL, NULL, NULL);
INSERT INTO `sys_dict_type` VALUES (20, '显示类型', 'display_type', '1', NULL, '2023-11-14 21:01:16', NULL, NULL, NULL);
INSERT INTO `sys_dict_type` VALUES (21, '时间格式', 'date_format', '1', NULL, '2023-11-14 22:14:25', NULL, NULL, NULL);
INSERT INTO `sys_dict_type` VALUES (22, '是否缓存', 'is_cache', '1', NULL, '2023-11-17 21:08:48', NULL, '2023-11-17 21:13:07', NULL);
INSERT INTO `sys_dict_type` VALUES (23, '是否外链', 'is_frame', '1', NULL, '2023-11-17 21:11:59', NULL, '2023-11-17 21:33:43', NULL);
INSERT INTO `sys_dict_type` VALUES (24, '菜单类型', 'menu_type', '1', NULL, '2023-11-17 21:20:02', NULL, NULL, NULL);

-- ----------------------------
-- Table structure for sys_ip_back
-- ----------------------------
DROP TABLE IF EXISTS `sys_ip_back`;
CREATE TABLE `sys_ip_back`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `ip_addr` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT 'IP地址',
  `type` varchar(25) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT 'IP类型',
  `mark` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '备注信息',
  `create_by` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_ip_back
-- ----------------------------
INSERT INTO `sys_ip_back` VALUES (1, '192.168.31.175', 'ipv4', NULL, NULL, '2023-10-22 18:50:05', NULL, NULL);
INSERT INTO `sys_ip_back` VALUES (4, '116.169.2.24', 'ipv4', NULL, NULL, '2023-10-22 23:52:20', NULL, NULL);
INSERT INTO `sys_ip_back` VALUES (5, '36.170.56.252', 'ipv4', NULL, NULL, '2023-10-23 00:15:36', NULL, NULL);

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu`  (
  `menu_id` bigint NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `menu_name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '菜单名称',
  `parent_id` bigint NULL DEFAULT 0 COMMENT '父菜单ID',
  `menu_type` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '菜单类型（M目录 C菜单 B按钮）',
  `order_num` int NULL DEFAULT 0 COMMENT '显示顺序',
  `path` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '路由地址',
  `path_params` varchar(2048) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '路径参数',
  `component` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '组件路径',
  `is_frame` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '0',
  `is_cache` int NULL DEFAULT 0 COMMENT '是否缓存（0缓存 1不缓存）',
  `no_redirect` int NULL DEFAULT 1 COMMENT '是否重定向',
  `breadcrumb` int NULL DEFAULT 1 COMMENT '是否展示面包屑',
  `visible` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '0' COMMENT '菜单状态（0显示 1隐藏）',
  `state` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '0' COMMENT '菜单状态（0正常 1停用）',
  `perms` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '权限标识',
  `icon` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '菜单图标',
  `create_by` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `create_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `update_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '备注',
  PRIMARY KEY (`menu_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1203 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '菜单权限表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
INSERT INTO `sys_menu` VALUES (1, '系统管理', 0, 'D', 1, 'system', NULL, ' ', '0', 0, 1, 1, '0', '1', '', 'setting', '1', '2018-03-16 11:33:00', 'admin', '2023-10-23 20:48:54', '系统管理目录');
INSERT INTO `sys_menu` VALUES (2, '系统监控', 0, 'D', 2, 'monitor', NULL, NULL, '0', 0, 1, 1, '0', '1', '', 'data_board', '0', '2018-03-16 11:33:00', 'admin', '2023-10-23 21:00:29', '系统监控目录');
INSERT INTO `sys_menu` VALUES (3, '系统工具', 0, 'D', 3, 'tool', NULL, NULL, '0', 0, 1, 1, '0', '1', '', 'mokuaiguanli', '0', '2018-03-16 11:33:00', 'admin', '2023-10-23 21:00:54', '系统工具目录');
INSERT INTO `sys_menu` VALUES (100, '用户管理', 1, 'M', 1, 'user', '{\"userId\": \"123\"}', 'system/user/index', '0', 0, 0, 1, '0', '1', 'system:user:list', 'User', '0', '2018-03-16 11:33:00', 'admin', '2023-08-23 14:39:12', '用户管理菜单');
INSERT INTO `sys_menu` VALUES (101, '角色管理', 1, 'M', 2, 'role', NULL, 'system/role/index', '0', 0, 0, 1, '0', '1', 'system:role:list', 'Avatar', '0', '2018-03-16 11:33:00', 'admin', '2023-06-02 15:30:09', '角色管理菜单');
INSERT INTO `sys_menu` VALUES (102, '菜单管理', 1, 'M', 3, 'menu', NULL, 'system/menu/index', '0', 0, 0, 1, '0', '1', 'system:menu:list', 'Menu', '0', '2018-03-16 11:33:00', 'admin', '2023-05-21 20:21:57', '菜单管理菜单');
INSERT INTO `sys_menu` VALUES (103, '部门管理', 1, 'M', 4, 'dept', NULL, 'system/dept/index', '0', 0, 0, 1, '0', '1', 'system:dept:list', 'bumenguanli', '0', '2018-03-16 11:33:00', 'admin', '2023-07-19 17:04:53', '部门管理菜单');
INSERT INTO `sys_menu` VALUES (104, '岗位管理', 1, 'M', 6, 'post', NULL, 'system/post/index', '0', 0, 0, 1, '0', '1', 'system:post:list', 'Management', '0', '2018-03-16 11:33:00', 'admin', '2023-06-02 15:33:15', '岗位管理菜单');
INSERT INTO `sys_menu` VALUES (105, '字典管理', 3, 'M', 7, 'dict', NULL, 'tool/dict/index', '0', 0, 0, 1, '0', '1', 'tool:dict:list', 'zidianpeizhi', '0', '2018-03-16 11:33:00', 'admin', '2023-07-19 17:18:28', '字典管理菜单');
INSERT INTO `sys_menu` VALUES (106, '参数设置', 3, 'M', 8, 'config', NULL, 'system/config/index', '0', 0, 0, 1, '0', '1', 'system:config:list', 'canshu', '0', '2018-03-16 11:33:00', 'admin', '2023-07-19 17:24:39', '参数设置菜单');
INSERT INTO `sys_menu` VALUES (107, '公告管理', 1, 'D', 9, 'notice', NULL, 'system/notice/index', '0', 0, 0, 1, '0', '1', 'system:notice:list', 'Message', '0', '2018-03-16 11:33:00', 'admin', '2023-08-01 13:27:11', '通知公告菜单');
INSERT INTO `sys_menu` VALUES (108, '日志管理', 2, 'D', 10, 'log', NULL, 'system/log/index', '0', 0, 1, 1, '0', '1', '', 'Tickets', '0', '2018-03-16 11:33:00', 'admin', '2023-05-29 00:35:49', '日志管理菜单');
INSERT INTO `sys_menu` VALUES (109, '在线用户', 2, 'M', 1, 'online', NULL, 'monitor/online/index', '0', 0, 0, 1, '0', '1', 'monitor:online:list', 'zaixianyonghu', '0', '2018-03-16 11:33:00', 'admin', '2023-07-19 17:09:00', '在线用户菜单');
INSERT INTO `sys_menu` VALUES (114, '代码生成', 1151, 'M', 2, 'gen', NULL, 'rapid/gen/index', '0', 0, 0, 1, '0', '1', 'rapid:gen:list', 'daimashengcheng', '0', '2018-03-16 11:33:00', 'admin', '2023-07-19 17:23:31', '代码生成菜单');
INSERT INTO `sys_menu` VALUES (500, '操作日志', 108, 'M', 1, 'operlog', NULL, 'monitor/operlog/index', '0', 0, 0, 1, '0', '1', 'monitor:operlog:list', 'caozuorizhi', '0', '2018-03-16 11:33:00', 'admin', '2023-07-19 17:13:51', '操作日志菜单');
INSERT INTO `sys_menu` VALUES (501, '登录日志', 108, 'M', 2, 'logininfor', NULL, 'monitor/logininfor/index', '0', 0, 0, 1, '0', '1', 'monitor:logininfor:list', 'guanlidenglurizhi', '0', '2018-03-16 11:33:00', 'admin', '2023-07-19 17:14:26', '登录日志菜单');
INSERT INTO `sys_menu` VALUES (1001, '用户查询', 100, 'B', 1, '', NULL, '', '0', 0, 1, 1, '0', '1', 'admin:user:list', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1002, '用户新增', 100, 'B', 2, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:user:add', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1003, '用户修改', 100, 'B', 3, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:user:edit', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1004, '用户删除', 100, 'B', 4, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:user:remove', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1005, '用户导出', 100, 'B', 5, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:user:export', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1006, '用户导入', 100, 'B', 6, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:user:import', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1007, '重置密码', 100, 'B', 7, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:user:resetPwd', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1008, '角色查询', 101, 'B', 1, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:role:query', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1009, '角色新增', 101, 'B', 2, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:role:add', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1010, '角色修改', 101, 'B', 3, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:role:edit', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1011, '角色删除', 101, 'B', 4, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:role:remove', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1012, '角色导出', 101, 'B', 5, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:role:export', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1013, '菜单查询', 102, 'B', 1, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:menu:query', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1014, '菜单新增', 102, 'B', 2, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:menu:add', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1015, '菜单修改', 102, 'B', 3, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:menu:edit', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1016, '菜单删除', 102, 'B', 4, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:menu:remove', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1017, '部门查询', 103, 'B', 1, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:dept:query', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1018, '部门新增', 103, 'B', 2, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:dept:add', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1019, '部门修改', 103, 'B', 3, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:dept:edit', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1020, '部门删除', 103, 'B', 4, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:dept:remove', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1021, '岗位查询', 104, 'B', 1, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:post:query', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1022, '岗位新增', 104, 'B', 2, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:post:add', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1023, '岗位修改', 104, 'B', 3, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:post:edit', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1024, '岗位删除', 104, 'B', 4, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:post:remove', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1025, '岗位导出', 104, 'B', 5, '', NULL, '', '0', 0, 1, 1, '0', '1', 'system:post:export', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1026, '字典查询', 105, 'B', 1, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'system:dict:query', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1027, '字典新增', 105, 'B', 2, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'system:dict:add', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1028, '字典修改', 105, 'B', 3, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'system:dict:edit', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1029, '字典删除', 105, 'B', 4, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'system:dict:remove', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1030, '字典导出', 105, 'B', 5, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'system:dict:export', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1031, '参数查询', 106, 'B', 1, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'system:config:query', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1032, '参数新增', 106, 'B', 2, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'system:config:add', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1033, '参数修改', 106, 'B', 3, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'system:config:edit', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1034, '参数删除', 106, 'B', 4, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'system:config:remove', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1035, '参数导出', 106, 'B', 5, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'system:config:export', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1036, '公告查询', 107, 'B', 1, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'system:notice:query', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1037, '公告新增', 107, 'B', 2, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'system:notice:add', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1038, '公告修改', 107, 'B', 3, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'system:notice:edit', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1039, '公告删除', 107, 'B', 4, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'system:notice:remove', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1040, '操作查询', 500, 'B', 1, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'monitor:operlog:query', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1041, '操作删除', 500, 'B', 2, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'monitor:operlog:remove', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1042, '日志导出', 500, 'B', 4, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'monitor:operlog:export', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1043, '登录查询', 501, 'B', 1, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'monitor:logininfor:query', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1044, '登录删除', 501, 'B', 2, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'monitor:logininfor:remove', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1045, '日志导出', 501, 'B', 3, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'monitor:logininfor:export', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1046, '在线查询', 109, 'B', 1, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'monitor:online:query', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1047, '批量强退', 109, 'B', 2, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'monitor:online:batchLogout', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1048, '单条强退', 109, 'B', 3, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'monitor:online:forceLogout', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1055, '生成查询', 114, 'B', 1, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'tool:gen:query', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1056, '生成修改', 114, 'B', 2, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'tool:gen:edit', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1057, '生成删除', 114, 'B', 3, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'tool:gen:remove', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1058, '导入代码', 114, 'B', 2, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'tool:gen:import', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1059, '预览代码', 114, 'B', 4, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'tool:gen:preview', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1060, '生成代码', 114, 'B', 5, '#', NULL, '', '0', 0, 1, 1, '0', '1', 'tool:gen:code', '', '0', '2018-03-16 11:33:00', '0', '2018-03-16 11:33:00', '');
INSERT INTO `sys_menu` VALUES (1151, '快速开发', 0, 'D', 3, 'rapid', NULL, NULL, '0', 0, 1, 1, '0', '1', NULL, 'device_develop', 'admin', '2023-05-26 22:04:31', 'admin', '2023-10-23 21:01:06', '');
INSERT INTO `sys_menu` VALUES (1152, '数据源', 1151, 'M', 0, 'data', NULL, 'rapid/source/index', '0', 0, 1, 1, '0', '1', 'rapid:source:list', 'shujuyuan', 'admin', '2023-05-26 22:07:31', 'admin', '2023-07-19 17:25:38', '');
INSERT INTO `sys_menu` VALUES (1153, '正则校验', 1151, 'M', 0, 'regular', NULL, 'rapid/regular/index', '0', 0, 1, 1, '0', '1', 'rapid:regular:list', 'xiaoyanjieguo', 'admin', '2023-05-28 18:09:11', 'admin', '2023-07-19 17:23:21', '');
INSERT INTO `sys_menu` VALUES (1161, '用户角色关联', 101, 'B', 0, '', NULL, NULL, '0', 0, 1, 1, '0', '1', NULL, NULL, 'admin', '2023-06-16 19:29:09', NULL, NULL, '');
INSERT INTO `sys_menu` VALUES (1168, '发布公告', 107, 'M', 9, 'notice/publish', NULL, 'system/notice/publish/index', '0', 0, 1, 1, '0', '1', 'system:notice:list', 'Message', 'admin', '2023-07-26 21:26:59', 'admin', '2023-07-26 21:28:30', '');
INSERT INTO `sys_menu` VALUES (1170, '通知公告', 107, 'M', 0, 'inform/index', NULL, 'system/notice/inform/index', '0', 0, 1, 1, '0', '1', 'system:notify:list', 'Message', 'admin', '2023-08-02 13:51:19', NULL, NULL, '');

-- ----------------------------
-- Table structure for sys_post
-- ----------------------------
DROP TABLE IF EXISTS `sys_post`;
CREATE TABLE `sys_post`  (
  `post_id` int NOT NULL AUTO_INCREMENT COMMENT '岗位ID',
  `post_code` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '岗位编码',
  `post_name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '岗位名称',
  `post_sort` int NOT NULL COMMENT '显示顺序',
  `state` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '状态（0正常 1停用）',
  `create_by` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`post_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '岗位信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_post
-- ----------------------------
INSERT INTO `sys_post` VALUES (3, 'hr', '人力资源', 3, '1', '1', '2018-03-16 11:33:00', '2', '2024-02-01 11:26:26', '');

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
  `role_id` bigint NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '角色名称',
  `role_key` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '角色权限字符串',
  `role_sort` int NOT NULL COMMENT '显示顺序',
  `data_scope` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '1' COMMENT '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）',
  `state` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '角色状态（0正常 1停用）',
  `del_flag` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `create_by` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `create_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `update_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '备注',
  `role_type` int NULL DEFAULT 1 COMMENT '角色类型(1:普通角色,2:文件角色)',
  PRIMARY KEY (`role_id`) USING BTREE,
  INDEX `role_state`(`state` ASC) USING BTREE COMMENT '角色state索引',
  INDEX `role_del_flag`(`del_flag` ASC) USING BTREE COMMENT '角色删除标记索引'
) ENGINE = InnoDB AUTO_INCREMENT = 225 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '角色信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role
-- ----------------------------

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu`  (
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `menu_id` bigint NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`role_id`, `menu_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '角色和菜单关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `user_id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `dept_id` bigint NULL DEFAULT NULL COMMENT '部门ID',
  `user_name` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '用户账号',
  `nick_name` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '用户昵称',
  `user_type` varchar(2) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '00' COMMENT '用户类型（00系统用户）',
  `email` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '用户邮箱',
  `phone_number` varchar(11) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '手机号码',
  `sex` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '0' COMMENT '用户性别（0男 1女 2未知）',
  `avatar` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '头像地址',
  `password` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '密码',
  `state` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '0' COMMENT '帐号状态（0正常 1停用）',
  `del_flag` varchar(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '0' COMMENT '删除标识',
  `login_ip` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '最后登录IP',
  `login_date` timestamp NULL DEFAULT NULL COMMENT '最后登录时间',
  `open_id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT 'openid',
  `union_id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT 'union_id',
  `create_by` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '创建者',
  `create_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '更新者',
  `update_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`user_id`) USING BTREE,
  INDEX `user_dept`(`dept_id` ASC) USING BTREE COMMENT '用户部门索引',
  INDEX `user_state`(`state` ASC) USING BTREE COMMENT '用户状态索引',
  INDEX `user_del_flag`(`del_flag` ASC) USING BTREE COMMENT '用户删除标记索引',
  INDEX `user_open_id`(`open_id` ASC, `union_id` ASC) USING BTREE COMMENT '微信方面索引'
) ENGINE = InnoDB AUTO_INCREMENT = 243 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '用户信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (1, 100, 'admin', '管理员', '00', '123456@qq.com', '13111111111', '0', 'http://cz.mytwins.top/0.jpeg', '$2a$10$QEmzU4cs/liZOIz1lQfv/uZWJ0qm5leFhxUUkA3B8Uv4crkQZM3ci', '1', '0', '127.0.0.1', '2018-03-16 11:33:00', NULL, NULL, '1', '2018-03-16 11:33:00', '2', '2023-10-20 22:54:04', '管理员');

-- ----------------------------
-- Table structure for sys_user_post
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_post`;
CREATE TABLE `sys_user_post`  (
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `post_id` bigint NOT NULL COMMENT '岗位ID',
  PRIMARY KEY (`user_id`, `post_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '用户与岗位关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_post
-- ----------------------------

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role`  (
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`user_id`, `role_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '用户和角色关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------

-- ----------------------------
-- Table structure for undo_log
-- ----------------------------
DROP TABLE IF EXISTS `undo_log`;
CREATE TABLE `undo_log`  (
  `branch_id` bigint NOT NULL COMMENT 'branch transaction id',
  `xid` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'global transaction id',
  `context` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'undo_log context,such as serialization',
  `rollback_info` longblob NOT NULL COMMENT 'rollback info',
  `log_status` int NOT NULL COMMENT '0:normal status,1:defense status',
  `log_created` datetime(6) NOT NULL COMMENT 'create datetime',
  `log_modified` datetime(6) NOT NULL COMMENT 'modify datetime',
  UNIQUE INDEX `ux_undo_log`(`xid` ASC, `branch_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'AT transaction mode undo table' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of undo_log
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
