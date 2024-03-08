package cn.fateverse.notice.handler;

import cn.fateverse.notice.entity.NoticeMq;
import cn.fateverse.notice.entity.UserInfo;
import cn.fateverse.notice.entity.vo.NotifyVo;
import com.alibaba.fastjson2.JSONObject;
import io.netty.channel.Channel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.function.Predicate;

import static cn.fateverse.notice.constant.NoticeConstant.*;

/**
 * @author Clay
 * @date 2023-04-15
 */
@Slf4j
@Component
public class NoticeConsumeHandler {

    /**
     * 消费公告
     *
     * @param notice 公告
     * @return 发送结果
     */
    public boolean consumeNotice(NoticeMq notice) {
        switch (notice.getSendType()) {
            case USER:
                return sendUser(notice);
            case ROLE:
                return sendRole(notice);
            case DEPT:
                return sendDept(notice);
            case ALL:
                return sendAllUser(notice);
            default:
                return false;
        }
    }

    /**
     * 向用户发送
     *
     * @param notice 公告
     * @return 发送结果
     */
    private boolean sendUser(NoticeMq notice) {
        //多个用户或者当前用户拥有多个连接时,判断当前用户是否处于活跃状态
        Predicate<Channel> predicate = channel -> {
            UserInfo userInfo = channel.attr(ChannelHandlerPool.USER_INFO).get();
            return notice.getSenderIds().contains(Long.valueOf(userInfo.getUserId()));
        };
        return ChannelHandlerPool.sendPredicateChannel(predicate, notice);
    }

    /**
     * 向角色发送
     *
     * @param notice 公告
     * @return 发送结果
     */
    private boolean sendRole(NoticeMq notice) {
        Predicate<Channel> predicate = channel -> {
            UserInfo userInfo = channel.attr(ChannelHandlerPool.USER_INFO).get();
            List<Long> senderIds = notice.getSenderIds();
            boolean flag = false;
            Set<Long> roleSet = userInfo.getRoleSet();
            for (Long senderId : senderIds) {
                flag = roleSet.contains(senderId);
                if (flag) {
                    break;
                }
            }
            return flag;
        };
        return ChannelHandlerPool.sendPredicateChannel(predicate, notice);
    }

    /**
     * 向部门发送
     *
     * @param notice 公告
     * @return 发送结果
     */
    private boolean sendDept(NoticeMq notice) {
        Predicate<Channel> predicate = channel -> {
            UserInfo userInfo = channel.attr(ChannelHandlerPool.USER_INFO).get();
            boolean state = false;
            //查询当前用户部门是否匹配
            state = notice.getSenderIds().contains(userInfo.getDeptId());
            //匹配直接返回
            if (state) {
                return Boolean.TRUE;
            }
            //不匹配则查询当前用户的组级id是否存在当前部门id,存在则返回
            for (Long senderId : notice.getSenderIds()) {
                state = userInfo.getDeptAncestors().contains(senderId);
                if (state) {
                    break;
                }
            }
            return state;
        };
        return ChannelHandlerPool.sendPredicateChannel(predicate, notice);
    }

    /**
     * 向所有的用户发送
     *
     * @param notice 公告
     * @return 发送结果
     */
    private boolean sendAllUser(NoticeMq notice) {
        Predicate<Channel> predicate = channel -> true;
        return ChannelHandlerPool.sendPredicateChannel(predicate, notice);
    }

}
