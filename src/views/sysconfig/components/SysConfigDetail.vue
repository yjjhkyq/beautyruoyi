<template>
  <el-container>
    <el-header>
      <el-button type="primary" @click="save('form', false)">保存</el-button>
      <el-button v-if="isEdit !== true" type="primary" @click="save('form', true)">保存&继续</el-button>
    </el-header>
    <el-main>
      <el-form v-loading="loading" ref="form" :rules="rules" :model="createEditModel" label-width="80px">
        <el-form-item label="参数名称" prop="configName">
          <el-input v-model="createEditModel.configName"/>
        </el-form-item>
        <el-form-item label="参数键名" prop="configKey">
          <el-input v-model="createEditModel.configKey"/>
        </el-form-item>
        <el-form-item label="参数键值" prop="configValue">
          <el-input v-model="createEditModel.configValue"/>
        </el-form-item>
        <el-form-item label="系统内置">
          <el-select v-model="createEditModel.configType">
            <el-option v-for="item in SystemDictDataEnum" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="createEditModel.remark" :rows="2" type="textarea"/>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
import DictData from '@/constants/dictdata'
import { fetchSysConfigBy, createUpdateSysConfig } from '@/api/system'
const defaultForm = {
  configId: 0,
  configName: '',
  configKey: '',
  configValue: '',
  configType: DictData.SystemDictDataEnum[0].value,
  remark: ''
}
export default {
  name: 'SysConfigDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      createEditModel: Object.assign({}, defaultForm),
      loading: false,
      SystemDictDataEnum: DictData.SystemDictDataEnum,
      rules: {
        configName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        configKey: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        configValue: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      fetchSysConfigBy({ configId: id }).then(res => {
        this.createEditModel = res.data[0]
        console.log('create edit model' + JSON.stringify(this.createEditModel))
      }
      ).catch(ex => {
        this.loading = false
      });
    } else {
      this.createEditModel = Object.assign({}, defaultForm)
      this.createEditModel.dictType = this.$route.params.dictType
      this.loading = false
    }
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    // this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    save(formName, continueEdit) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          var postData = Object.assign({}, this.createEditModel)
          createUpdateSysConfig(postData).then(res => {
            console.log('create success');
            this.loading = false
            this.$notify({
              message: '操作成功',
              type: 'success'
            });
            if (continueEdit === true) {
              this.createEditModel = Object.assign({}, defaultForm)
            } else {
              this.$store.dispatch('delView', this.$route).then(res => {
                this.$router.push('/system/config/list')
              });
            }
          }).catch(ex => {
            console.log('create dept error');
            this.loading = false
          })
        }
      });
    }
  }
}
</script>
