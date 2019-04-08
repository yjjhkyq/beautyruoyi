<template>
  <sys-config-detail :is-edit="true"/>
</template>

<script>
import SysConfigDetail from './components/SysConfigDetail'

export default {
  name: 'EditForm',
  components: { SysConfigDetail }
}
</script>

