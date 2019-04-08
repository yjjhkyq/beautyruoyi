<template>
  <sys-config-detail :is-edit="false"/>
</template>

<script>
import SysConfigDetail from './components/SysConfigDetail'

export default {
  name: 'CreateForm',
  components: { SysConfigDetail }
}
</script>
