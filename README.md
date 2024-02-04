# 系统说明

- 基于 Spring Cloud 2021 、Spring Boot 2.7、 Spring Security 的权限管理系统
- 采用前后端分离的模式,前端(基于 FateVerse-React, FateVerse-Vue)
- 注册中心,配置中心使用Nacos,权限认证使用Spring Security + Redis
- 流量控制使用Sentinel，分布式事务选用Seata
- gitea+drone+harbor+rancher全套部署流程

## 快速开始

### 核心依赖

| 依赖                   | 版本         |
|----------------------|------------|
| Spring Boot          | 2.7.5      |
| Spring Cloud         | 2021.0.5   |
| Spring Cloud Alibaba | 2021.0.4.0 |
| Mybatis              | 3.5.2      |
| Vue                  | 3.1.3      |
| React                | 3.1.3      |

### 模块说明

```lua
FateVerse
├── auth -- 授权服务提供
└── common -- 系统公共模块
     ├── common-core -- 公共工具类核心包
     ├── common-dubbo -- dubbo rpc服务
     ├── common-email -- 邮件发送服务
     ├── common-file -- 分布式文件存储
     ├── common-mybatis -- mybatis 扩展封装
     ├── common-redis -- redis序列化封装
     ├── common-security -- 安全工具类
     ├── common-swagger -- swagger接口文档
     ├── common-log -- 系统日志记录
     └── common-websocket -- netty集群实现的websocket服务
└── notice -- 通用消息公告模块
     ├── notice-api -- 通用消息公告模块公共api模块
     └── notice-biz -- 通用消息公告模块业务处理模块[5000]
└── admin -- 通用用户权限管理模块
     ├── admin-api -- 通用用户权限管理系统公共api模块
     └── admin-biz -- 通用用户权限管理系统业务处理模块[4000]
└── visual -- 图形化管理模块
     ├── code-gen -- 代码生成模块
     ├── custom-query -- 自定义查询模块
     ├── flowable -- flowable实现的workflow模块
     ├── monitor -- 服务监控
     ├── sentinel-dashboard -- sentinel 官方版
     ├── sentinel-dashboard-pro -- sentinel 线上版,集成nacos
     └── xxl-job-admin -- 定时任务管理器
```

### 本地开发 运行

### 对象存储

在 SpringBoot **FTP**、**minio**、SFTP、WebDAV、谷歌云存储、**阿里云OSS**、华为云OBS、七牛云Kodo、腾讯云COS、百度云
BOS、又拍云USS、MinIO、 AWS S3、金山云
KS3、美团云 MSS、京东云 OSS、天翼云 OOS、移动云 EOS、沃云 OSS、 网易数帆 NOS、Ucloud US3、青云 QingStor、平安云 OBS、首云 OSS、IBM
COS、其它兼容 S3 协议的平台

### 压力测试

- 4*8 单节点测试结果
  ![qps_test.png](qps_test.png)