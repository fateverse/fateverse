package cn.fateverse.common.log.config;

import cn.fateverse.common.log.enums.LogLeve;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author Clay
 * @date 2023-05-25
 */
@ConfigurationProperties(prefix = "operation-log")
public class OperationProperties {

   private Boolean enabled;

   // all success error
   private LogLeve level;

   private Integer cacheSize;



   public Boolean getEnabled() {
      return enabled == null || enabled;
   }

   public void setEnabled(Boolean enabled) {
      this.enabled = enabled;
   }

   public LogLeve getLevel() {
      if (null == level){
         return LogLeve.ALL;
      }
      return level;
   }

   public void setLevel(LogLeve level) {
      this.level = level;
   }

   public Integer getCacheSize() {
      if (null == cacheSize){
         cacheSize = 8;
      }
      return cacheSize;
   }

   public void setCacheSize(Integer cacheSize) {

      this.cacheSize = cacheSize;
   }
}
