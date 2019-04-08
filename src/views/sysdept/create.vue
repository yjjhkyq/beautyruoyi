<template>
  <sys-dept-detail :is-edit="false"/>
</template>

<script>
import SysDeptDetail from './components/SysDeptDetail'

export default {
  name: 'CreateForm',
  components: { SysDeptDetail }
}
</script>
