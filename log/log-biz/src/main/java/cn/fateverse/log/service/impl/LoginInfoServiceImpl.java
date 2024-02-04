package cn.fateverse.log.service.impl;

import cn.fateverse.log.entity.LoginInfo;
import cn.fateverse.log.mapper.LoginInfoMapper;
import cn.fateverse.log.query.LoginLogQuery;
import cn.fateverse.log.service.LoginInfoService;
import cn.fateverse.log.utils.IpLocation;
import cn.fateverse.log.vo.LoginInfoVo;
import cn.hutool.core.util.StrUtil;
import cn.fateverse.common.core.result.page.TableDataInfo;
import cn.fateverse.common.mybatis.utils.PageUtils;
import cn.fateverse.common.security.entity.LoginUser;
import cn.fateverse.common.security.service.TokenService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/2
 */
@Slf4j
@Service
public class LoginInfoServiceImpl implements LoginInfoService {

    private final LoginInfoMapper loginInfoMapper;

    private final TokenService tokenService;

    public LoginInfoServiceImpl(LoginInfoMapper loginInfoMapper,
                                TokenService tokenService) {
        this.loginInfoMapper = loginInfoMapper;
        this.tokenService = tokenService;
    }


    @Override
    public int save(LoginInfo info) {
        String ipddr = info.getIpddr();
        if (!StrUtil.isEmpty(ipddr)) {
            info.setLoginLocation(IpLocation.getRegion(ipddr.split(",")[0]));
        }
        if (!StrUtil.isEmpty(info.getUuid())) {
            LoginUser loginUser = tokenService.getLoginUserUUid(info.getUuid());
            if (StrUtil.isEmpty(loginUser.getLoginLocation())) {
                loginUser.setLoginLocation(info.getLoginLocation());
                tokenService.setLoginUser(loginUser);
            }
        }
        return loginInfoMapper.save(info);
    }

    @Override
    public TableDataInfo<LoginInfoVo> search(LoginLogQuery loginLogQuery) {
        PageUtils.startPage();
        List<LoginInfo> loginInfos = loginInfoMapper.search(loginLogQuery);
        return PageUtils.convertDataTable(loginInfos, LoginInfoVo::toLoginInfoVo);
    }

    @Override
    public void delete(Long[] infoIds) {
        loginInfoMapper.delete(infoIds);
    }

    @Override
    public LoginInfoVo select(Long infoId) {
        LoginInfo loginInfo = loginInfoMapper.selectById(infoId);
        return LoginInfoVo.toLoginInfoVo(loginInfo);
    }
}
