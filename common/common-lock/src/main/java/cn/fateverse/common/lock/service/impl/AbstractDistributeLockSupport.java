package cn.fateverse.common.lock.service.impl;

import cn.fateverse.common.lock.base.DistributeLockParam;
import cn.fateverse.common.lock.enums.DistributeLockType;
import cn.fateverse.common.lock.service.DistributeLockSupport;
import com.google.common.base.Joiner;
import com.google.common.base.Preconditions;
import org.apache.commons.lang3.StringUtils;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

/**
 * @author Clay
 * @date 2023-05-10
 */
public abstract class AbstractDistributeLockSupport<T> implements DistributeLockSupport<T> {


    /**
     * 检验参数
     *
     * @param distributeLockParam 锁参数
     * @return 锁参数
     */
    protected DistributeLockParam fullDistributeDefaultValue(DistributeLockParam distributeLockParam) {
        Preconditions.checkNotNull(distributeLockParam, "检测到了参数不允许为空！");
        //对默认值进行填充
        distributeLockParam.setLockType(Optional.ofNullable(distributeLockParam.getLockType()).orElse(DistributeLockType.FAIR_LOCK));
        distributeLockParam.setExpireTime(Optional.ofNullable(distributeLockParam.getExpireTime()).orElse(DEFAULT_EXPIRE_TIME));
        distributeLockParam.setWaitTime(Optional.ofNullable(distributeLockParam.getExpireTime()).orElse(DEFAULT_WAIT_TIME));
        distributeLockParam.setTimeUnit(Optional.ofNullable(distributeLockParam.getTimeUnit()).orElse(TimeUnit.SECONDS));
        return distributeLockParam;
    }


    /**
     * 构建相关的锁key值
     *
     * @param distributeLockParam 锁参数
     * @return 锁key
     */
    protected String buildLockKey(DistributeLockParam distributeLockParam) {
        String lockId = StringUtils.defaultIfEmpty(distributeLockParam.getLockUuid(),
                java.util.UUID.randomUUID().toString());
        distributeLockParam.setLockUuid(lockId);
        String delmiter = StringUtils.defaultIfEmpty(distributeLockParam.getDelimiter(),
                DEFAULT_DELIMITER);
        distributeLockParam.setDelimiter(delmiter);
        String prefix = StringUtils.defaultIfEmpty(distributeLockParam
                .getLockNamePrefix(), DEFAULT_KEY_PREFIX);
        distributeLockParam.setLockNamePrefix(prefix);
        String lockFullName = "";
        if (!delmiter.equals(DEFAULT_DELIMITER)) {
            //todo 待优化
            Joiner joiner = Joiner.on(delmiter).skipNulls();
            lockFullName = joiner.join(prefix, lockId);
        } else {
            lockFullName = DEFAULT_JOINER.join(prefix, lockId);
        }
        return lockFullName;
    }

}
