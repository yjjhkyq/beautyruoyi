<template>
  <sys-user-detail :is-edit="true"/>
</template>

<script>
import SysUserDetail from './components/SysUserDetail'

export default {
  name: 'EditForm',
  components: { SysUserDetail }
}
</script>

