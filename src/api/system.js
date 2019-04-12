import request from '@/utils/request'
import { AddToken } from '@/utils/auth'
import { addURLParam } from '@/utils/index'
/**
 * 查询部门
 * @param {*} data 查询条件
 */
export function fetchSysDeptList(data) {
  return request({
    url: '/system/dept/list',
    method: 'post',
    data
  })
}

/**
 * 新增部门
 * @param {*} data 部门
 */
export function createUpdateSysDept(data) {
  let url = '/system/dept/create'
  if (data.deptId > 0) {
    url = '/system/dept/update'
  }
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 更新部门
 * @param {*} data 部门
 */
export function updateSysDept(data) {
  return request({
    url: '/system/dept/update',
    method: 'post',
    data
  })
}

/**
 * 删除部门
 * @param {} deptId 部门id
 */
export function deleteSysDept(deptId) {
  return request({
    url: '/system/dept/delete',
    method: 'post',
    params: { deptId }
  })
}

/**
 * 精确查询部门信息
 * @param {*} data 搜索条件
 */
export function fetchSystemDeptBy(data) {
  return request({
    url: '/system/dept/getby',
    method: 'post',
    data
  })
}

/**
 * 搜索岗位信息
 * @param {*} data 查询条件
 */
export function fetchSysPostList(page, data) {
  return request({
    url: '/system/post/list',
    method: 'post',
    data,
    params: page
  })
}

/**
 * 搜索岗位信息
 * @param {*} data 查询条件
 */
export function fetchAllSysPostList(data) {
  return request({
    url: '/system/post/listAll',
    method: 'post',
    data
  })
}

/**
 * 新增 修改 岗位信息
 * @param {*} data 岗位
 */
export function createUpdateSysPost(data) {
  let url = '/system/post/create'
  if (data.postId > 0) {
    url = '/system/post/update'
  }
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 岗位精确查询
 * @param {*} postId 岗位id
 */
export function fetchSysPostBy(data) {
  return request({
    url: '/system/post/getby',
    method: 'post',
    data
  })
}

/**
 * 删除岗位信息
 * @param {*} ids 岗位id,用,分割
 */
export function deleteSysPost(ids) {
  return request({
    url: '/system/post/delete',
    method: 'post',
    params: { ids }
  })
}

/**
 * 搜索字典类型
 * @param {*} data 查询条件
 */
export function fetchSysDictList(page, data) {
  return request({
    url: '/system/dict/list',
    method: 'post',
    data,
    params: page
  })
}

/**
 * 新增 修改 字典类型
 * @param {*} data 字典类型
 */
export function createUpdateSysDict(data) {
  let url = '/system/dict/create'
  if (data.dictId > 0) {
    url = '/system/dict/update'
  }
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 字典类型精确查询
 * @param {*} data 查询条件
 */
export function fetchSysDictBy(data) {
  return request({
    url: '/system/dict/getby',
    method: 'post',
    data
  })
}

/**
 * 删除字典类型
 * @param {*} ids 字典类型id,用,分割
 */
export function deleteSysDict(ids) {
  return request({
    url: '/system/dict/delete',
    method: 'post',
    params: { ids }
  })
}

/**
 * 搜索字典数据
 * @param {*} data 查询条件
 */
export function fetchSysDictDataList(data) {
  return request({
    url: '/system/dict/data/list',
    method: 'post',
    data
  })
}

/**
 * 新增 修改 字典数据
 * @param {*} data 字典数据
 */
export function createUpdateSysDictData(data) {
  let url = '/system/dict/data/create'
  if (data.dictCode > 0) {
    url = '/system/dict/data/update'
  }
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 字典数据精确查询
 * @param {*} data 查询条件
 */
export function fetchSysDictDataBy(data) {
  return request({
    url: '/system/dict/data/getby',
    method: 'post',
    data
  })
}

/**
 * 字典数据精确查询
 * @param {*} dictType 字典类型
 */
export function fetchSysDictDataByDictType(dictType) {
  return request({
    url: '/system/dict/data/getby',
    method: 'post',
    data: { dictType }
  })
}

/**
 * 删除字典数据
 * @param {*} ids 字典数据id,用,分割
 */
export function deleteSysDictData(ids) {
  return request({
    url: '/system/dict/data/delete',
    method: 'post',
    params: { ids }
  })
}

/**
 * 搜索参数配置
 * @param {*} data 查询条件
 */
export function fetchSysConfigList(data) {
  return request({
    url: '/system/config/list',
    method: 'post',
    data
  })
}

/**
 * 新增 修改 参数配置
 * @param {*} data 参数配置
 */
export function createUpdateSysConfig(data) {
  let url = '/system/config/create'
  if (data.configId > 0) {
    url = '/system/config/update'
  }
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 参数配置精确查询
 * @param {*} data 查询条件
 */
export function fetchSysConfigBy(data) {
  return request({
    url: '/system/config/getby',
    method: 'post',
    data
  })
}

/**
 * 删除参数配置
 * @param {*} ids 参数配置id,用,分割
 */
export function deleteSysConfig(ids) {
  return request({
    url: '/system/config/delete',
    method: 'post',
    params: { ids }
  })
}

/**
 * 搜索公告信息
 * @param {*} data 查询条件
 */
export function fetchSysNoticeList(data) {
  return request({
    url: '/system/notice/list',
    method: 'post',
    data
  })
}

/**
 * 新增 修改 通知
 * @param {*} data 通知模型
 */
export function createUpdateSysNotice(data) {
  let url = '/system/notice/create'
  if (data.noticeId > 0) {
    url = '/system/notice/update'
  }
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 通知公告精确查询
 * @param {*} data 查询条件
 */
export function fetchSysNoticeBy(data) {
  return request({
    url: '/system/notice/getby',
    method: 'post',
    data
  })
}

/**
 * 删除通知公告
 * @param {*} ids 参数配置id,用,分割
 */
export function deleteSysNotice(ids) {
  return request({
    url: '/system/notice/delete',
    method: 'post',
    params: { ids }
  })
}
/**
 * 搜索菜单信息
 * @param {*} data 查询条件
 */
export function fetchSysMenuList(data) {
  return request({
    url: '/system/menu/list',
    method: 'post',
    data
  })
}

/**
 * 新增 修改 菜单
 * @param {*} data 菜单
 */
export function createUpdateSysMenu(data) {
  let url = '/system/menu/create'
  if (data.noticeId > 0) {
    url = '/system/menu/update'
  }
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 菜单精确查询
 * @param {*} data 查询条件
 */
export function fetchSysMenuBy(data) {
  return request({
    url: '/system/menu/getby',
    method: 'post',
    data
  })
}

/**
 * 删除菜单
 * @param {*} menuId 菜单id,用,分割
 */
export function deleteSysMenu(menuId) {
  return request({
    url: '/system/menu/delete',
    method: 'post',
    params: { menuId }
  })
}

/**
 * 搜索角色信息
 * @param {*} data 查询条件
 */
export function fetchSysRoleList(page, data) {
  return request({
    url: '/system/role/list',
    method: 'post',
    params: page,
    data
  })
}

/**
 * 搜索角色信息
 * @param {*} data 查询条件
 */
export function fetchAllSysRoleList(data) {
  return request({
    url: '/system/role/listAll',
    method: 'post',
    data
  })
}

/**
 * 新增 修改 角色
 * @param {*} data 菜单
 */
export function createUpdateSysRole(data) {
  let url = '/system/role/create'
  if (data.menuId > 0) {
    url = '/system/role/update'
  }
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 菜单精确查询
 * @param {*} data 查询条件
 */
export function fetchSysRoleBy(roleId) {
  return request({
    url: '/system/role/getby',
    method: 'post',
    params: { roleId }
  })
}

/**
 * 删除角色
 * @param {*} ids 角色id,用,分割
 */
export function deleteSysRole(ids) {
  return request({
    url: '/system/role/delete',
    method: 'post',
    params: { ids }
  })
}

/**
 * 修改角色状态
 * @param {*} data 角色
 */
export function changeSysRoleStatus(data) {
  return request({
    url: '/system/role/changeStatus',
    method: 'post',
    data
  })
}

/**
 * 获取角色下菜单权限
 * @param {*} roleId 角色id
 */
export function fetchSysMenuByRoldId(roleId) {
  return request({
    url: '/system/role/menu/list',
    method: 'post',
    params: { roleId }
  })
}

/**
 * 设置角色菜单
 * @param {*} roleId 角色id
 * @param {*} data 菜单列表
 */
export function setRoleMenu(roleId, data) {
  return request({
    url: '/system/role/menu/setRoleMenu',
    method: 'post',
    params: { roleId },
    data
  })
}

/**
 * 搜索用户信息
 * @param {*} data 查询条件
 * @param {*} page 分页
 */
export function fetchSysUserList(page, data) {
  return request({
    url: '/system/user/list',
    method: 'post',
    params: page,
    data
  })
}

/**
 * 新增 修改 用户
 * @param {*} data 菜单
 */
export function createUpdateSysUser(data) {
  let url = '/system/user/create'
  if (data.userId > 0) {
    url = '/system/user/update'
  }
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 用户精确查询
 * @param {*} data 查询条件
 */
export function fetchSysUserBy(data) {
  return request({
    url: '/system/user/getby',
    method: 'post',
    data
  })
}

/**
 * 删除用户
 * @param {*} ids 用户id,用,分割
 */
export function deleteSysUser(ids) {
  return request({
    url: '/system/user/delete',
    method: 'post',
    params: { ids }
  })
}

/**
 * 启用停用用户
 * @param {*} data 用户
 */
export function changeSysUserStatus(data) {
  return request({
    url: '/system/user/changeStatus',
    method: 'post',
    data
  })
}

/**
 * 修改密码
 * @param {*} data 用户
 */
export function resetSysUserPwd(data) {
  return request({
    url: '/system/user/resetPwd',
    method: 'post',
    data
  })
}

/**
 * 修改密码
 * @param {*} data 用户
 */
export function changeSysUserPwd(data) {
  return request({
    url: '/system/user/changeMyPwd',
    method: 'post',
    data
  })
}

/**
 * 更新我的用户信息
 * @param {*} data 用户
 */
export function updateMyInfo(data) {
  return request({
    url: '/system/user/updateMyInfo',
    method: 'post',
    data
  })
}

/**
 * 更新我的头像
 * @param {*} data 用户
 */
export function updateMyAvatar(data) {
  return request({
    url: '/system/user/updateMyAvatar',
    method: 'post',
    data
  })
}

/**
 * 获取我的信息
 */
export function myProfile() {
  return request({
    url: '/system/user/myProfile'
  })
}

/**
 * 获取操作日志
 * @param {*} page 分页
 * @param {*} data 搜索条件
 */
export function fetchSysOperLogList(page, data) {
  return request({
    url: '/monitor/operlog/list',
    method: 'post',
    params: page,
    data
  })
}

/**
 * 删除操作日志
 * @param {*} ids 操作日志id, 用,分割
 */
export function deleteSysOperLog(ids) {
  return request({
    url: '/monitor/operlog/delete',
    method: 'post',
    params: ids
  })
}

/**
 * 操作日志精确查询
 * @param {*} data 查询条件
 */
export function fetchSysOperLogBy(operId) {
  return request({
    url: '/monitor/operlog/getby',
    method: 'post',
    params: operId
  })
}

/**
 * 清空操作日志
 */
export function cleanSysOperLog() {
  return request({
    url: '/monitor/operlog/clean',
    method: 'post'
  })
}

/**
 * 搜索定时任务
 * @param {*} data 查询条件
 */
export function fetchSysJobList(page, data) {
  return request({
    url: '/monitor/job/list',
    method: 'post',
    params: page,
    data
  })
}

/**
 * 新增 修改 定时任务
 * @param {*} data 定时任务
 */
export function createUpdateSysJob(data) {
  let url = '/monitor/job/create'
  if (data.jobId > 0) {
    url = '/monitor/job/update'
  }
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 定时任务精确查询
 * @param {*} data 查询条件
 */
export function fetchSysJobBy(jobId) {
  return request({
    url: '/monitor/job/getby',
    method: 'post',
    params: { jobId }
  })
}

/**
 * 删除定时任务
 * @param {*} ids 定时任务id,用,分割
 */
export function deleteSysJob(ids) {
  return request({
    url: '/monitor/job/delete',
    method: 'post',
    params: { ids }
  })
}

/**
 * 启用停用定时任务
 * @param {*} data 定时任务
 */
export function changeSysJobStatus(data) {
  return request({
    url: '/monitor/job/changeStatus',
    method: 'post',
    data
  })
}

/**
 * 运行定时任务
 * @param {*} data 定时任务
 */
export function runSysJob(jobId) {
  return request({
    url: '/monitor/job/run',
    method: 'post',
    params: { jobId }
  })
}

/**
 * 获取定时任务日志
 * @param {*} page 分页
 * @param {*} data 搜索条件
 */
export function fetchSysJobLogList(page, data) {
  return request({
    url: '/monitor/jobLog/list',
    method: 'post',
    params: page,
    data
  })
}

/**
 * 删除定时任务操作日志
 * @param {*} ids 操作日志id, 用,分割
 */
export function deleteSysJobLog(ids) {
  console.log('delete job log :' + ids)
  return request({
    url: '/monitor/jobLog/delete',
    method: 'post',
    params: { ids }
  })
}

/**
 * 清空定时任务操作日志
 */
export function cleanSysJobLog() {
  return request({
    url: '/monitor/jobLog/clean',
    method: 'post'
  })
}

/**
 * 获取文件上传url
 */
export function getFileUploadUrl() {
  return process.env.BASE_API + '/system/file/upload'
}

/**
 * 获取文件下载url
 * @param {*} fileId 文件id
 */
export function getFileDownloadUrl(fileId) {
  if (fileId > 0) {
    return  addURLParam(AddToken(process.env.BASE_API + '/system/file/download'), 'fileId', fileId)
  }
  return ''
}
