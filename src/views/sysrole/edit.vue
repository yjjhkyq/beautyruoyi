<template>
  <sys-role-detail :is-edit="true"/>
</template>

<script>
import SysRoleDetail from './components/SysRoleDetail'

export default {
  name: 'EditForm',
  components: { SysRoleDetail }
}
</script>

