<template>
  <sys-job-detail :is-edit="true"/>
</template>

<script>
import SysJobDetail from './components/SysJobDetail'

export default {
  name: 'EditForm',
  components: { SysJobDetail }
}
</script>

