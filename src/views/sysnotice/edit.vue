<template>
  <sys-notice-detail :is-edit="true"/>
</template>

<script>
import SysNoticeDetail from './components/SysNoticeDetail'

export default {
  name: 'EditForm',
  components: { SysNoticeDetail }
}
</script>

