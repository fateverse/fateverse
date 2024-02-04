package cn.fateverse.admin.service.impl;

import cn.fateverse.common.core.entity.PageInfo;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.TableSupport;
import cn.hutool.core.util.StrUtil;
import cn.fateverse.admin.entity.OnlineUser;
import cn.fateverse.admin.service.OnlineUserService;
import cn.fateverse.common.core.constant.CacheConstants;
import cn.fateverse.common.security.entity.LoginUser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author Clay
 * @date 2022/11/12
 */
@Slf4j
@Service
public class OnlineUserServiceImpl implements OnlineUserService {


    @Resource
    private RedisTemplate<String, LoginUser> redisTemplate;


    /**
     * todo 现阶段一次性将所有用户全部返回,后期想办法进行分页操作
     *
     * @param place
     * @param username
     * @return
     */
    @Override
    public TableDataInfo<OnlineUser> searchList(String place, String username) {
        Cursor<String> scan = redisTemplate.scan(ScanOptions.scanOptions().match(CacheConstants.LOGIN_TOKEN_KEY + "*").count(1000).build());
        List<String> keys = scan.stream().collect(Collectors.toList());
        if (keys.isEmpty()) {
            return new TableDataInfo<>(new ArrayList<>(), 0);
        }
        PageInfo pageInfo = TableSupport.buildPageRequest();
        Integer pageNum = pageInfo.getPageNum();
        Integer pageSize = pageInfo.getPageSize();
        int startNum = (pageNum - 1) * pageSize;
        int endNum = pageNum * pageSize;
        List<String> search;
        if (keys.size() < startNum) {
            return new TableDataInfo<>(new ArrayList<>(), keys.size());
        } else if (keys.size() > startNum && keys.size() < endNum) {
            search = keys.subList(startNum, keys.size());
        } else {
            search = keys.subList(startNum, endNum);
        }
        List<LoginUser> multiCacheMapValue = redisTemplate.opsForValue().multiGet(search);
        if (multiCacheMapValue == null || multiCacheMapValue.isEmpty()) {
            return new TableDataInfo<>(new ArrayList<>(), keys.size());
        }
        List<OnlineUser> list = multiCacheMapValue.stream()
                //.filter(user -> checkQuery(user, place, username))
                .map(this::toOnlineUser)
                .collect(Collectors.toList());
        return new TableDataInfo<>(list, keys.size());
    }

    @Override
    public void force(String tokenId) {
        redisTemplate.delete(CacheConstants.LOGIN_TOKEN_KEY + tokenId);
    }

    private OnlineUser toOnlineUser(LoginUser user) {
        return OnlineUser.builder()
                .tokenId(user.getUuid())
                .username(user.getUsername())
                .deptName(user.getUser().getDept().getDeptName())
                .ipAddr(user.getIpddr())
                .loginLocation(user.getLoginLocation())
                .browser(user.getBrowser())
                .os(user.getOs())
                .loginTime(new Date(user.getLoginTime()))
                .build();
    }


    /**
     * 过滤用户信息
     *
     * @param user
     * @param place
     * @param username
     * @return
     */
    private boolean checkQuery(LoginUser user, String place, String username) {
        if (!StrUtil.isEmpty(place) && !StrUtil.isEmpty(username)) {
            return user.getLoginLocation().contains(place) && user.getUsername().contains(username);
        } else if (!StrUtil.isEmpty(place)) {
            return user.getLoginLocation().contains(place);
        } else if (!StrUtil.isEmpty(username)) {
            return user.getUsername().contains(username);
        }
        return true;
    }


}
