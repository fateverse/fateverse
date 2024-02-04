package cn.fateverse.admin.service.impl;

import cn.fateverse.admin.dto.IpBackDto;
import cn.fateverse.admin.entity.IpBack;
import cn.fateverse.admin.mapper.IpBackMapper;
import cn.fateverse.admin.query.IpBackQuery;
import cn.fateverse.admin.service.IpBackService;
import cn.fateverse.admin.vo.IpBackVo;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.IpBackUtils;
import cn.fateverse.common.mybatis.utils.PageUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Set;

/**
 * @author Clay
 * @date 2023-10-22
 */
@Slf4j
@Service
public class IpBackServiceImpl implements IpBackService {

    private final IpBackMapper ipBackMapper;

    private final RedisTemplate<String, String> redisTemplate;

    private final ThreadPoolTaskExecutor executor;

    public IpBackServiceImpl(IpBackMapper ipBackMapper,
                             RedisTemplate<String, String> redisTemplate, ThreadPoolTaskExecutor executor) {
        this.ipBackMapper = ipBackMapper;
        this.redisTemplate = redisTemplate;
        this.executor = executor;
    }


    @PostConstruct
    public void init() {
        executor.execute(this::loadIpBackList);
    }


    public void loadIpBackList() {
        Set<String> keys = redisTemplate.keys(IpBackUtils.BLACK_LIST_IP);
        if (keys != null && keys.size() == 1) {
            return;
        }
        int pageSize = 100;
        int pageNum = 1;
        int count = pageSize;
        while (pageSize == count) {
            List<IpBack> list = ipBackMapper.selectListStartEnd((pageNum - 1) * pageSize, pageNum * pageSize);
            for (IpBack back : list) {
                refreshCache(back);
            }
            count = list.size();
            pageNum++;
        }
    }


    @Override
    public TableDataInfo<IpBackVo> search(IpBackQuery query) {
        PageUtils.startPage();
        List<IpBack> list = ipBackMapper.selectList(query);
        return PageUtils.convertDataTable(list, IpBack::toIPBackVo);
    }

    @Override
    public Boolean match(String ipAddress) {
        //String ipType = IpBackUtils.getIpType(ipAddress);
        //switch (ipType) {
        //    case IPV_4:
        //        return checkIpv4(ipAddress);
        //    case IPV_6:
        //        return checkIpv6(ipAddress);
        //}
        return redisTemplate.opsForSet().isMember(IpBackUtils.BLACK_LIST_IP, ipAddress);
    }

    private Boolean checkIpv4(String ipAddress) {
        long ip = IpBackUtils.ipToDecimal(ipAddress);
        //return redisTemplate.opsForValue().getBit(IpBackUtils.BLACK_LIST_IPV_4, ip);
        return redisTemplate.opsForSet().isMember(IpBackUtils.BLACK_LIST_IPV_4, ipAddress);
    }

    private Boolean checkIpv6(String ipAddress) {
        return redisTemplate.opsForSet().isMember(IpBackUtils.BLACK_LIST_IPV_6, ipAddress);
    }


    @Override
    public IpBackVo searchById(Long id) {
        IpBack ipBack = ipBackMapper.selectById(id);
        if (null == ipBack) {
            throw new CustomException("查询结果为空");
        }
        return ipBack.toIPBackVo();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void save(IpBackDto dto) {
        IpBack ipBack = ipBackMapper.selectByIdaddr(dto.getIpAddr());
        if (ipBack != null) {
            throw new CustomException("该ip已经存在");
        }
        String ipType = IpBackUtils.getIpType(dto.getIpAddr());
        IpBack back = new IpBack();
        back.setType(ipType);
        back.setIpAddr(dto.getIpAddr());
        ipBackMapper.insert(back);
        IpBack newItem = ipBackMapper.selectById(back.getId());
        if (newItem != null) {
            refreshCache(back);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void edit(IpBackDto dto) {
        IpBack oldItem = ipBackMapper.selectById(dto.getId());
        if (oldItem == null) {
            throw new CustomException("更新失败");
        }
        String ipType = IpBackUtils.getIpType(dto.getIpAddr());
        IpBack back = new IpBack();
        back.setId(dto.getId());
        back.setType(ipType);
        back.setIpAddr(dto.getIpAddr());
        ipBackMapper.update(back);
        IpBack newItem = ipBackMapper.selectById(dto.getId());
        if (newItem.getIpAddr().equals(dto.getIpAddr())) {
            removeCache(oldItem);
            refreshCache(back);
        } else {
            throw new CustomException("更新失败");
        }
    }

    private void refreshCache(IpBack back) {
        //switch (back.getType()) {
        //    case IPV_4:
        //        long ip = IpBackUtils.ipToDecimal(back.getIpAddr());
        //        //redisTemplate.opsForValue().setBit(IpBackUtils.BLACK_LIST_IPV_4, ip, true);
        //        redisTemplate.opsForSet().add(IpBackUtils.BLACK_LIST_IPV_4, back.getIpAddr());
        //        break;
        //    case IPV_6:

        redisTemplate.opsForSet().add(IpBackUtils.BLACK_LIST_IP, back.getIpAddr());
        //redisTemplate.opsForSet().add(IpBackUtils.BLACK_LIST_IP, new String(back.getIpAddr().getBytes(StandardCharsets.UTF_8)));
        //break;
        //}

    }

    private void removeCache(IpBack oldItem) {
        //switch (oldItem.getType()) {
        //case IPV_4:
        //    long oldIp = IpBackUtils.ipToDecimal(oldItem.getIpAddr());
        //    //redisTemplate.opsForValue().setBit(IpBackUtils.BLACK_LIST_IPV_4, oldIp, false);
        //    redisTemplate.opsForSet().remove(IpBackUtils.BLACK_LIST_IPV_4, oldItem.getIpAddr());
        //    break;
        //case IPV_6:
        redisTemplate.opsForSet().remove(IpBackUtils.BLACK_LIST_IP, oldItem.getIpAddr());
        //        break;
        //}
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(List<Long> ids) {
        List<IpBack> ipBacks = ipBackMapper.selectByIds(ids);
        ipBackMapper.delete(ids);
        if (ipBacks != null && !ipBacks.isEmpty()) {
            for (IpBack ipBack : ipBacks) {
                removeCache(ipBack);
            }
        }
    }

}
