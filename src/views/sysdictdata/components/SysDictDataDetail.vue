<template>
  <el-container>
    <el-header>
      <el-button type="primary" @click="save('form', false)">保存</el-button>
      <el-button v-if="isEdit !== true" type="primary" @click="save('form', true)">保存&继续</el-button>
    </el-header>
    <el-main>
      <el-form v-loading="loading" ref="form" :rules="rules" :model="createEditModel" label-width="80px">
        <el-form-item label="字典标签" prop="dictLabel">
          <el-input v-model="createEditModel.dictLabel"/>
        </el-form-item>
        <el-form-item label="字典键值" prop="dictValue">
          <el-input v-model="createEditModel.dictValue"/>
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="createEditModel.dictType" readonly/>
        </el-form-item>
        <el-form-item label="样式属性" prop="cssClass">
          <el-input v-model="createEditModel.cssClass"/>
        </el-form-item>
        <el-form-item label="字典排序" prop="dictSort">
          <el-input-number v-model="createEditModel.dictSort" :min="0"/>
        </el-form-item>
        <el-form-item label="回显样式">
          <el-select v-model="createEditModel.listClass">
            <el-option v-for="item in ListClassEnum" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="系统默认">
          <el-select v-model="createEditModel.isDefault">
            <el-option v-for="item in SystemDictDataEnum" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="createEditModel.status">
            <el-option v-for="item in EnableDisableStatus" :key="item.value" :label="item.label" :value="item.value"/>
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
import { fetchSysDictDataBy, createUpdateSysDictData } from '@/api/system'
const defaultForm = {
  dictCode: 0,
  dictLabel: '',
  dictValue: '',
  dictType: '',
  cssClass: '',
  dictSort: 0,
  listClass: DictData.ListClassEnum[0].value,
  isDefault: DictData.SystemDictDataEnum[0].value,
  status: DictData.EnableDisableStatus[0].value,
  remark: ''
}
export default {
  name: 'SysDictDataDetail',
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
      EnableDisableStatus: DictData.EnableDisableStatus,
      ListClassEnum: DictData.ListClassEnum,
      SystemDictDataEnum: DictData.SystemDictDataEnum,
      rules: {
        dictLabel: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        dictValue: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      fetchSysDictDataBy({ dictCode: id }).then(res => {
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
          createUpdateSysDictData(postData).then(res => {
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
                this.$router.go(-1)
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
