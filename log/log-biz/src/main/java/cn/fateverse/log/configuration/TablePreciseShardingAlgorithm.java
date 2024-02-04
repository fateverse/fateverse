package cn.fateverse.log.configuration;

import cn.hutool.core.convert.Convert;
import org.apache.shardingsphere.api.sharding.standard.PreciseShardingAlgorithm;
import org.apache.shardingsphere.api.sharding.standard.PreciseShardingValue;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Random;

/**
 * @author Clay
 * @date 2023-05-25
 */
public class TablePreciseShardingAlgorithm implements PreciseShardingAlgorithm<Long> {
    /**
     * 执行分片操作
     *
     * @param tableNames           表名集合
     * @param preciseShardingValue 精确分片值
     * @return 分片后的表名
     */
    @Override
    public String doSharding(Collection<String> tableNames, PreciseShardingValue<Long> preciseShardingValue) {
        BigDecimal bigDecimal = new BigDecimal(preciseShardingValue.getValue());
        long value = bigDecimal.divide(new BigDecimal(10), 0, RoundingMode.DOWN).longValue();
        int index = Convert.toInt(value & 1);
        List<String> list = new ArrayList<>(tableNames);
        return list.get(index);
    }

}
