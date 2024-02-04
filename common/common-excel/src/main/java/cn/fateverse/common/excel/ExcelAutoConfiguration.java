package cn.fateverse.common.excel;

import cn.fateverse.common.excel.service.ExcelService;
import org.springframework.context.annotation.Bean;

/**
 * @author Clay
 * @date 2023-11-10  20:18
 */
public class ExcelAutoConfiguration {

    /**
     * Excel导出时字典对接服务等
     *
     * @return excelService
     */
    @Bean
    public ExcelService excelService() {
        return new ExcelService();
    }


}
