// 停用启用状态
const EnableDisableStatus = [{ value: 0, label: '正常' }, { value: 1, label: '停用' }]
const EnableStatus = { Enable: 0, Disable: 1 }
// 是否默认
const SystemDictDataEnum = [{ value: 'N', label: '否' }, { value: 'Y', label: '是' }]
const ListClassEnum = [{ value: 'text', label: '默认' }, { value: 'primary', label: '主要' }, { value: 'success', label: '成功' },
  { value: 'info', label: '信息' }, { value: 'warning', label: '警告' }, { value: 'danger', label: '危险' }]
// 系统字典类型
const DictTypes = {
  sys_notice_type: 'sys_notice_type', // 通知类型
  sys_menu_type: 'sys_menu_type', // 菜单类型
  sys_show_hide: 'sys_show_hide', // 菜单状态
  sys_user_sex: 'sys_user_sex', // 用户性别
  sys_oper_type: 'sys_oper_type', // 操作类型
  sys_oper_status: 'sys_oper_status', // 操作状态
  sys_job_status: 'sys_job_status', // 定时任务状态
  sys_job_misfire_policy: 'sys_job_misfire_policy', // 定时任务计划策略
  sys_job_exe_status: 'sys_job_exe_status' // 定时任务执行状态
}
// 菜单类型
const SysMenuTypeEnum = {
  Directory: 0, // 目录
  Menu: 1, // 菜单
  Button: 2 // 按钮
}
export default{
  EnableDisableStatus: EnableDisableStatus,
  EnableStatus: EnableStatus,
  SystemDictDataEnum: SystemDictDataEnum,
  ListClassEnum: ListClassEnum,
  DictTypes: DictTypes,
  SysMenuTypeEnum
}
