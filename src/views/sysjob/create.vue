<template>
  <sys-job-detail :is-edit="false"/>
</template>

<script>
import SysJobDetail from './components/SysJobDetail'

export default {
  name: 'CreateForm',
  components: { SysJobDetail }
}
</script>
