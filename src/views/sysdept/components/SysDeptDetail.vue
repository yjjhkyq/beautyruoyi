<template>
  <el-container>
    <el-header>
      <el-button type="primary" @click="save('form', false)">保存</el-button>
      <el-button v-if="isEdit !== true" type="primary" @click="save('form', true)">保存&继续</el-button>
    </el-header>
    <el-main>
      <el-form v-loading="loading" ref="form" :rules="rules" :model="createEditModel" label-width="80px">
        <el-form-item label="上级部门">
          <el-cascader :options="deptTree" v-model="createEditModel.ancestors" :props="props" change-on-select @change="handleDeptSelected" />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="createEditModel.deptName"/>
        </el-form-item>
        <el-form-item label="显示顺序">
          <el-input-number v-model="createEditModel.orderNum" :min="0"/>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="createEditModel.leader"/>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="createEditModel.phone"/>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="createEditModel.email"/>
        </el-form-item>
        <el-form-item label="部门状态">
          <el-select v-model="createEditModel.status">
            <el-option v-for="item in EnableDisableStatus" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
import DictData from '@/constants/dictdata'
import { fetchSysDeptList, fetchSystemDeptBy, createUpdateSysDept } from '@/api/system'
import { listToTree } from '@/utils/index'
const defaultForm = {
  deptId: 0,
  parentId: 0,
  deptName: '',
  ancestors: [],
  orderNum: 0,
  leader: '',
  phone: '',
  email: '',
  status: DictData.EnableDisableStatus[0].value
};
export default {
  name: 'SysDeptDetail',
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
      deptTree: [],
      EnableDisableStatus: DictData.EnableDisableStatus,
      rules: {
        deptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ]
      },
      props: { value: 'deptId', label: 'deptName' }
    }
  },
  created() {
    fetchSysDeptList({}).then(res => {
      this.deptTree = listToTree(res.data, 'deptId')
      console.log('list data ' + JSON.stringify(this.deptTree))
      if (this.isEdit) {
        const id = this.$route.params && this.$route.params.id
        fetchSystemDeptBy({ deptId: id }).then(res => {
          res.data.ancestors = res.data.ancestors.split(',').slice(1)
          this.createEditModel = res.data
          console.log('create edit model' + JSON.stringify(this.createEditModel))
        }
        ).catch(ex => {
          this.loading = false
        });
      } else {
        this.createEditModel = Object.assign({}, defaultForm)
        this.loading = false
      }
    }).catch(ex => {
      this.loading = false
    })
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
          if (postData.ancestors === null || postData.ancestors.length === 0) {
            postData.parentId = 0
          } else {
            postData.parentId = postData.ancestors[postData.ancestors.length - 1]
          }
          postData.ancestors = postData.ancestors.join(',')
          createUpdateSysDept(postData).then(res => {
            console.log('create dept success');
            this.loading = false
            this.$notify({
              message: '操作成功',
              type: 'success'
            });
            if (continueEdit === true) {
              this.createEditModel = Object.assign({}, defaultForm)
            } else {
              this.$store.dispatch('delView', this.$route).then(res => {
                this.$router.push('/system/dept/list')
              });
            }
          }).catch(ex => {
            console.log('create dept error');
            this.loading = false
          })
        }
      });
    },
    handleDeptSelected(selectedValue) {
      console.log('selected tree value' + JSON.stringify(selectedValue));
    }
  }
}
</script>
