<template>
  <el-container>
    <el-header>
      <el-button type="primary" @click="save('form', false)">保存</el-button>
      <el-button v-if="isEdit !== true" type="primary" @click="save('form', true)">保存&继续</el-button>
    </el-header>
    <el-main>
      <el-form v-loading="loading" ref="form" :rules="rules" :model="createEditModel" label-width="80px">
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="createEditModel.userName"/>
        </el-form-item>
        <el-form-item label="归属部门" prop="deptAncestors">
          <el-cascader :options="DeptTree" v-model="createEditModel.deptAncestors" :props="props" change-on-select placeholder="请选择"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input v-model="createEditModel.phonenumber"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="createEditModel.email"/>
        </el-form-item>
        <el-form-item label="登录账号" prop="loginName">
          <el-input v-model="createEditModel.loginName" :readonly="isEdit === true"/>
        </el-form-item>
        <el-form-item label="用户性别" prop="sex">
          <el-select v-model="createEditModel.sex">
            <el-option v-for="item in UserSex" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
          <el-switch
            v-model="createEditModel.status"
            :active-value="0"
            :inactive-value="1"/>
        </el-form-item>
        <el-form-item label="岗位" prop="postIds">
          <el-select v-model="createEditModel.postIds" multiple placeholder="请选择">
            <el-option
              v-for="item in Posts"
              :key="item.postId"
              :label="item.postName"
              :value="item.postId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="createEditModel.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in Roles"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"/>
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
import { select, listToTree, getAncestors } from '@/utils/index'
import { fetchSysUserBy, createUpdateSysUser, fetchAllSysRoleList, fetchAllSysPostList, fetchSysDeptList, fetchSysDictDataList } from '@/api/system'
const defaultForm = {
  userId: 0,
  userName: '',
  deptId: '',
  deptAncestors: [],
  phonenumber: '',
  email: '',
  loginName: '',
  password: '',
  sex: null,
  status: DictData.EnableDisableStatus[0].value,
  roleSort: 0,
  postIds: [],
  roleIds: [],
  remark: ''
}
export default {
  name: 'SysUserDetail',
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
      UserSex: [],
      Posts: [],
      Roles: [],
      DeptList: [],
      DeptTree: [],
      props: { value: 'deptId', label: 'deptName' },
      rules: {
        userName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        deptAncestors: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        phonenumber: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        loginName: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loading = true
    Promise.all([fetchSysDeptList({}), fetchSysDictDataList({ dictType: DictData.DictTypes.sys_user_sex }),
      fetchAllSysPostList({}), fetchAllSysRoleList({})]).then(res => {
      this.DeptList = res[0].data
      this.DeptTree = listToTree(res[0].data, 'deptId')
      this.UserSex = res[1].data
      this.Posts = res[2].data.records
      this.Roles = res[3].data.records
      if (this.isEdit) {
        const id = this.$route.params && this.$route.params.id
        fetchSysUserBy({ userId: id }).then(res => {
          this.createEditModel = res.data
          if (this.createEditModel.deptId !== null && this.createEditModel.deptId > 0) {
            this.createEditModel.deptAncestors = getAncestors(this.DeptList, this.createEditModel.deptId, 'deptId', 'parentId')
            this.createEditModel.deptAncestors.push(this.createEditModel.deptId)
          }
          if (this.createEditModel.roleIds === null) {
            this.createEditModel.roleIds = []
          }
          if (this.createEditModel.postIds === null) {
            this.createEditModel.postIds = []
          }
          if (this.createEditModel.roles !== null) {
            this.createEditModel.roles.forEach(element => {
              this.createEditModel.roleIds.push(element.roleId)
            });
          }
          if (this.createEditModel.posts !== null) {
            this.createEditModel.posts.forEach(element => {
              this.createEditModel.postIds.push(element.postId)
            });
          }
          console.log('create edit model' + JSON.stringify(this.createEditModel))
          this.loading = false
        }
        ).catch(ex => {
          this.loading = false
        });
      } else {
        this.createEditModel = Object.assign({}, defaultForm)
        this.createEditModel.sex = this.UserSex[0].dictValue;
        this.createEditModel.status = this.EnableDisableStatus[0].value;
        this.loading = false
      }
    }).catch(ex => {
      console.log('error' + JSON.stringify(ex));
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
          if (postData.deptAncestors !== null && postData.deptAncestors.length > 0) {
            postData.deptId = postData.deptAncestors[postData.deptAncestors.length - 1]
          }
          createUpdateSysUser(postData).then(res => {
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
                this.$router.push('/system/user/list')
              });
            }
          }).catch(ex => {
            this.loading = false
          })
        }
      });
    }
  }
}
</script>
