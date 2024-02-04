# actuator 内容暴露安全控制
1. 使用一个与应用无关的端口暴露,在内网环境下,只会将内网的应用端口暴露,所以actuator的独立端口是不被外网感知的
```yaml
management:
  endpoints:
    web:
      exposure:
        include: "*"  
  server:
    port: 9595
  endpoint:
    health:
      show-details: ALWAYS
```
2. 使用exclude屏蔽掉访问的地址,比如gateway外网暴露就可以屏蔽掉外网gateway的域名
```yaml
management:
  endpoints:
    web:
      exposure:
        include: "*"  
        exclude: "需要屏蔽的地址"
  endpoint:
    health:
      show-details: ALWAYS
```