package cn.fateverse.notice.service.impl;

import cn.fateverse.admin.dubbo.DubboDeptService;
import cn.fateverse.admin.dubbo.DubboRoleService;
import cn.fateverse.admin.dubbo.DubboUserService;
import cn.fateverse.admin.vo.DeptVo;
import cn.fateverse.admin.vo.UserVo;
import cn.fateverse.common.core.exception.CustomException;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.core.utils.ObjectUtils;
import cn.fateverse.common.redis.constant.RedisConstant;
import cn.fateverse.common.mybatis.utils.PageUtils;
import cn.fateverse.notice.config.NoticeProperties;
import cn.fateverse.notice.constant.NoticeConstant;
import cn.fateverse.notice.dto.NoticeDto;
import cn.fateverse.notice.entity.Notice;
import cn.fateverse.notice.entity.NoticeMq;
import cn.fateverse.notice.entity.UserInfo;
import cn.fateverse.notice.entity.UserNotice;
import cn.fateverse.notice.entity.query.NoticeQuery;
import cn.fateverse.notice.entity.vo.NoticeVo;
import cn.fateverse.notice.enums.ActionEnums;
import cn.fateverse.notice.mapper.NoticeMapper;
import cn.fateverse.notice.mapper.UserNoticeMapper;
import cn.fateverse.notice.handler.ChannelHandlerPool;
import cn.fateverse.notice.service.NoticeService;
import cn.fateverse.common.security.utils.SecurityUtils;
import com.alibaba.fastjson2.JSON;
import lombok.extern.slf4j.Slf4j;
import org.apache.dubbo.config.annotation.DubboReference;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.BeanUtils;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.*;
import java.util.stream.Collectors;

import static cn.fateverse.notice.constant.NoticeConstant.*;

/**
 * @author Clay
 * @date 2023-05-04
 */
@Slf4j
@Service
public class NoticeServiceImpl implements NoticeService {

    @Resource
    private RedisTemplate<String, UserInfo> redisTemplate;

    @Resource
    private NoticeProperties properties;

    private final RabbitTemplate rabbitTemplate;

    private final NoticeMapper noticeMapper;

    private final UserNoticeMapper userNoticeMapper;

    @DubboReference
    private DubboUserService userService;

    @DubboReference
    private DubboRoleService roleService;

    @DubboReference
    private DubboDeptService deptService;


    public NoticeServiceImpl(RabbitTemplate rabbitTemplate, NoticeMapper noticeMapper,
                             UserNoticeMapper userNoticeMapper) {
        this.rabbitTemplate = rabbitTemplate;
        this.noticeMapper = noticeMapper;
        this.userNoticeMapper = userNoticeMapper;
    }


    @Override
    public NoticeVo searchById(Long noticeId) {
        Long publishId = adminOrUser();
        Notice notice = noticeMapper.selectById(noticeId, publishId);
        if (ObjectUtils.isEmpty(notice)) {
            return null;
        }
        NoticeVo vo = NoticeVo.toNoticeVo(notice);
        switch (vo.getSendType()) {
            case USER:
                userNotice(vo, notice);
                break;
            case ROLE:
                roleNotice(vo, notice);
                break;
            case DEPT:
                deptNotice(vo, notice);
                break;
            case ALL:
                vo.setSenders(Collections.singletonList("所有人"));
            default:
                break;
        }
        return vo;
    }

    private Long adminOrUser() {
        return SecurityUtils.isAdmin() ? null : SecurityUtils.getUserId();
    }

    /**
     * 用户通知
     *
     * @param vo     返回对象
     * @param notice 公告
     */
    private void userNotice(NoticeVo vo, Notice notice) {
        List<Long> senderIds = checkSenderIds(notice);
        if (senderIds == null) {
            return;
        }
        List<UserVo> userList = userService.searchUserListByUserIds(senderIds);
        if (null == userList || userList.isEmpty()) {
            return;
        }
        List<String> userInfo = userList.stream().map(UserVo::getUserName).collect(Collectors.toList());
        vo.setSenders(userInfo);
    }

    /**
     * 角色通知
     *
     * @param vo     返回对象
     * @param notice 公告
     */
    private void roleNotice(NoticeVo vo, Notice notice) {
        List<Long> senderIds = checkSenderIds(notice);
        if (senderIds == null) {
            return;
        }
        List<String> roleNames = roleService.searchRoleNameByIds(senderIds);
        vo.setSenders(roleNames);
    }

    /**
     * 部门通知
     *
     * @param vo     返回对象
     * @param notice 公告
     */
    private void deptNotice(NoticeVo vo, Notice notice) {
        List<Long> senderIds = checkSenderIds(notice);
        if (senderIds == null) {
            return;
        }
        List<DeptVo> deptList = deptService.searchDeptByDeptId(senderIds);
        if (null == deptList || deptList.isEmpty()) {
            return;
        }
        List<String> deptInfo = deptList.stream().map(DeptVo::getDeptName).collect(Collectors.toList());
        vo.setSenders(deptInfo);
    }

    /**
     * 检查发送人是否为空
     *
     * @param notice 公告
     * @return 发送对象的id
     */
    private List<Long> checkSenderIds(Notice notice) {
        List<Long> senderIds = JSON.parseArray(notice.getSenderIds(), Long.class);
        if (null == senderIds || senderIds.isEmpty()) {
            return null;
        }
        return senderIds;
    }


    @Override
    public TableDataInfo<NoticeVo> searchList(NoticeQuery query) {
        PageUtils.startPage();
        query.setPublishId(adminOrUser());
        List<Notice> list = noticeMapper.selectList(query);
        return PageUtils.convertDataTable(list, NoticeVo::toNoticeVo);
    }

    @Override
    public List<NoticeVo> exportList(NoticeQuery query) {
        List<Notice> list = noticeMapper.selectList(query);
        return list.stream().map(NoticeVo::toNoticeVo).collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void save(NoticeDto dto) {
        List<Long> userIds = null;
        //根据发送类型进行判断,然后获取到对应的用户id
        switch (dto.getSendType()) {
            case USER:
                userIds = dto.getSenderIds();
                break;
            case ROLE:
            case DEPT:
                List<UserVo> userVoList = ROLE.equals(dto.getSendType())
                        ? userService.searchUserListByRoleIds(dto.getSenderIds())
                        : userService.searchUserByDeptIds(dto.getSenderIds());
                userIds = userVoList.stream().map(UserVo::getUserId).collect(Collectors.toList());
                break;
            case ALL:
                userIds = userService.searchAllUserIds();
                break;
            default:
                break;
        }
        //如果用户id列表为空,则说明发送异常
        if (null == userIds || userIds.isEmpty()) {
            throw new CustomException("获取到用户id为空");
        }
        //将dto转换为数据库映射对象
        Notice notice = Notice.toNoticeMq(dto);
        Date date = new Date();
        //数据入库
        noticeMapper.insert(notice);
        //组装用户和消息的映射表
        List<UserNotice> userNoticeList = userIds.stream().map(userId ->
                UserNotice.builder()
                        .userId(userId)
                        .noticeId(notice.getNoticeId())
                        .state(NoticeConstant.NOT_READ)
                        .createTime(date)
                        .build()
        ).collect(Collectors.toList());
        //创建mq发送对象
        NoticeMq mq = new NoticeMq();
        BeanUtils.copyProperties(dto, mq);
        //mq中id回传
        mq.setNoticeId(notice.getNoticeId());
        //设置mq的动作为发送
        mq.setAction(ActionEnums.SEND);
        //判断当前需要发送的用户映射信息是否只有一条数据
        if (userNoticeList.size() == 1) {
            //获取到当前映射数据
            UserNotice userNotice = userNoticeList.get(0);
            //入库
            userNoticeMapper.insert(userNotice);
            //"userId:ip:time"
            //在Redis中过滤当前用户
            List<String> keys = new ArrayList<>();
            try (Cursor<String> cursor = redisTemplate.scan(ScanOptions.scanOptions().match(ChannelHandlerPool.getRedisKey(mq.getCluster()) + RedisConstant.REDIS_SEPARATOR + userNotice.getUserId() + RedisConstant.REDIS_SEPARATOR + "*").build());) {
                while (cursor.hasNext()) {
                    keys.add(cursor.next());
                }
            }
            //如果的当前用户只存在一个连接,直接发送当当前用户的队列之中
            if (keys.size() == 1) {
                String userKey = keys.get(0);
                UserInfo userInfo = redisTemplate.opsForValue().get(userKey);
                if (null != userInfo) {
                    boolean state = Boolean.TRUE.equals(rabbitTemplate.invoke(operations -> {
                        rabbitTemplate.convertAndSend(properties.getExchangeChatRanch(), userInfo.getRoutingKey(), mq);
                        return rabbitTemplate.waitForConfirms(5000);
                    }));
                    if (!state) {
                        log.error("mq消息发送失败!");
                        throw new CustomException("消息推送失败");
                    }
                }
            } else {
                sendNoticeBroadMq(mq);
            }
        } else {
            //多个用户则使用广播的方式进行发送,并且将映射关系批量添加到数据库
            userNoticeMapper.batchInsert(userNoticeList);
            sendNoticeBroadMq(mq);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void removeById(Long noticeId) {
        Notice notice = noticeMapper.selectById(noticeId, adminOrUser());
        if (ObjectUtils.isEmpty(notice)) {
            throw new CustomException("公告不存在");
        }
        //数据库中删除信息
        noticeMapper.deleteById(notice.getNoticeId());
        userNoticeMapper.deleteByNoticeId(noticeId);
        //整理mq消息
        NoticeMq mq = notice.toNoticeMq();
        //设置动作为删除
        mq.setAction(ActionEnums.REMOVE);
        //发送删除消息到mq
        sendNoticeBroadMq(mq);
    }

    /**
     * 广播的方式发送公告
     *
     * @param mq 消息内容
     */
    private void sendNoticeBroadMq(NoticeMq mq) {
        rabbitTemplate.setMandatory(true);
        boolean sendStart = Boolean.TRUE.equals(rabbitTemplate.invoke(operations -> {
            rabbitTemplate.convertAndSend(properties.getExchangeChatRanch(), properties.getRoutingKey() + "broad", mq);
            return rabbitTemplate.waitForConfirms(5000);
        }));
        if (!sendStart) {
            log.error("mq消息发送失败!");
            throw new CustomException("消息推送失败");
        }
    }
}
