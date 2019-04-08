<template>
  <sys-post-detail :is-edit="false"/>
</template>

<script>
import SysPostDetail from './components/SysPostDetail'

export default {
  name: 'CreateForm',
  components: { SysPostDetail }
}
</script>
