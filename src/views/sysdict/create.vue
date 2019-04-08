<template>
  <sys-dict-detail :is-edit="false"/>
</template>

<script>
import SysDictDetail from './components/SysDictDetail'

export default {
  name: 'CreateForm',
  components: { SysDictDetail }
}
</script>
