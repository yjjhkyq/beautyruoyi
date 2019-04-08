<template>
  <sys-role-detail :is-edit="false"/>
</template>

<script>
import SysRoleDetail from './components/SysRoleDetail'

export default {
  name: 'CreateForm',
  components: { SysRoleDetail }
}
</script>
