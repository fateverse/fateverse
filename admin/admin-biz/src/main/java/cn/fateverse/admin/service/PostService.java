package cn.fateverse.admin.service;

import cn.fateverse.admin.dto.PostDto;
import cn.fateverse.admin.query.PostQuery;
import cn.fateverse.admin.vo.PostVo;
import cn.fateverse.common.core.entity.Option;
import cn.fateverse.common.core.result.page.TableDataInfo;

import java.util.List;

/**
 * @author Clay
 * @date 2022/11/26
 */
public interface PostService {


    /**
     * 查询岗位列表
     *
     * @param query
     * @return
     */
    TableDataInfo<PostVo> searchList(PostQuery query);

    /**
     * 获取岗位的选择option选项
     *
     * @return
     */
    List<Option> searchOption();

    /**
     * 根据岗位id查询岗位信息
     *
     * @param id
     * @return
     */
    PostVo searchById(Long id);

    /**
     * 当前岗位下时候还有用户
     * @param postId
     * @return
     */
    boolean hasUserByRoleId(Long postId);

    /**
     * 保存岗位信息
     *
     * @param postDto@return
     */
    int save(PostDto postDto);

    /**
     * 编辑岗位信息
     *
     * @param postDto@return
     */
    int edit(PostDto postDto);

    /**
     * 删除岗位信息
     *
     * @param postId
     * @return
     */
    int removeById(Long postId);
}
