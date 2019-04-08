<template>
  <el-container>
    <el-header>
      <el-button type="primary" @click="save('form', false)">保存</el-button>
      <el-button v-if="isEdit !== true" type="primary" @click="save('form', true)">保存&继续</el-button>
    </el-header>
    <el-main>
      <el-form v-loading="loading" ref="form" :rules="rules" :model="createEditModel" label-width="100px">
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="createEditModel.jobName"/>
        </el-form-item>
        <el-form-item label="任务组名" prop="jobGroup">
          <el-input v-model="createEditModel.jobGroup"/>
        </el-form-item>
        <el-form-item label="方法名称" prop="methodName">
          <el-input v-model="createEditModel.methodName"/>
        </el-form-item>
        <el-form-item label="方法参数" prop="methodParams">
          <el-input v-model="createEditModel.methodParams"/>
        </el-form-item>
        <el-form-item label="cron表达式" prop="cronExpression">
          <el-input v-model="createEditModel.cronExpression"/>
        </el-form-item>
        <el-form-item label="执行策略">
          <el-select v-model="createEditModel.misfirePolicy">
            <el-option v-for="item in MisfirePolicys" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="createEditModel.status">
            <el-option v-for="item in JobStatus" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue"/>
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
import { fetchSysJobBy, createUpdateSysJob, getDictDataLabel, fetchSysDictDataBy } from '@/api/system'
const defaultForm = {
  jobId: 0,
  jobName: '',
  jobGroup: '',
  methodName: '',
  methodParams: '',
  cronExpression: '',
  misfirePolicy: '',
  status: '',
  remark: ''
}
export default {
  name: 'SysJobDetail',
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
      JobStatus: [],
      MisfirePolicys: [],
      rules: {
        jobName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        jobGroup: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        methodName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        cronExpression: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loading = true
    Promise.all([fetchSysDictDataBy({ dictType: DictData.DictTypes.sys_job_status }),
      fetchSysDictDataBy({ dictType: DictData.DictTypes.sys_job_misfire_policy })]).then(res => {
      this.JobStatus = res[0].data
      this.MisfirePolicys = res[1].data
      if (this.isEdit) {
        const jobId = this.$route.params && this.$route.params.id
        fetchSysJobBy(jobId).then(res => {
          this.createEditModel = res.data
          console.log('create edit model' + JSON.stringify(this.createEditModel))
          this.loading = false
        }
        ).catch(ex => {
          this.loading = false
        });
      } else {
        this.createEditModel = Object.assign({}, defaultForm)
        this.createEditModel.misfirePolicy = this.MisfirePolicys[0].dictValue
        this.createEditModel.status = this.JobStatus[0].dictValue
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
          createUpdateSysJob(postData).then(res => {
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
            console.log('create  error');
            this.loading = false
          })
        }
      });
    }
  }
}
</script>
