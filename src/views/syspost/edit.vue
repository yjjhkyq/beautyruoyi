<template>
  <sys-post-detail :is-edit="true"/>
</template>

<script>
import SysPostDetail from './components/SysPostDetail'

export default {
  name: 'EditForm',
  components: { SysPostDetail }
}
</script>

