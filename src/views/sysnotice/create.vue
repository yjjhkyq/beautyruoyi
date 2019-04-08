<template>
  <sys-notice-detail :is-edit="false"/>
</template>

<script>
import SysNoticeDetail from './components/SysNoticeDetail'

export default {
  name: 'CreateForm',
  components: { SysNoticeDetail }
}
</script>
