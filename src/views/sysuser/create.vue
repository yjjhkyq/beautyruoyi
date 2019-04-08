<template>
  <sys-user-detail :is-edit="false"/>
</template>

<script>
import SysUserDetail from './components/SysUserDetail'

export default {
  name: 'CreateForm',
  components: { SysUserDetail }
}
</script>
