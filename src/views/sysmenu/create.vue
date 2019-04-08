<template>
  <sys-menu-detail :is-edit="false"/>
</template>

<script>
import SysMenuDetail from './components/SysMenuDetail'

export default {
  name: 'CreateForm',
  components: { SysMenuDetail }
}
</script>
