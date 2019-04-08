<template>
  <sys-dict-data-detail :is-edit="false"/>
</template>

<script>
import SysDictDataDetail from './components/SysDictDataDetail'

export default {
  name: 'CreateForm',
  components: { SysDictDataDetail }
}
</script>
