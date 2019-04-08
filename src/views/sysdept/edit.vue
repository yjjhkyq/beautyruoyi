<template>
  <sys-dept-detail :is-edit="true"/>
</template>

<script>
import SysDeptDetail from './components/SysDeptDetail'

export default {
  name: 'EditForm',
  components: { SysDeptDetail }
}
</script>

