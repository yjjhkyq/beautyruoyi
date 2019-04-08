<template>
  <el-container v-loading="loading">
    <el-aside width="200px">
      <el-card>
        <div slot="header">
          <span>个人资料</span>
        </div>
        <el-row>
          <el-col>
            <span>登录名称：</span>
          </el-col>
          <el-col>
            <span>{{ userInfo.loginName }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <span>手机号码：</span>
          </el-col>
          <el-col>
            <span>{{ userInfo.phonenumber }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <span>所属部门：</span>
          </el-col>
          <el-col>
            <span>{{ userInfo.dept.deptName }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <span>岗位名称：</span>
          </el-col>
          <el-col>
            <span>{{ postNames }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <span>邮箱地址：</span>
          </el-col>
          <el-col>
            <span>{{ userInfo.email }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <span>创建时间：</span>
          </el-col>
          <el-col>
            <span>{{ userInfo.createTime }}</span>
          </el-col>
        </el-row>
      </el-card>
    </el-aside>
    <el-main>
      <el-card>
        <div slot="header">
          <span>基本资料</span>
        </div>
        <el-tabs value="first">
          <el-tab-pane label="基本资料" name="first">
            <el-form ref="updateMyInfoForm" :rules="updateMyInfoRules" :model="userInfo" label-width="80px">
              <el-form-item label="用户名称" prop="userName">
                <el-input v-model="userInfo.userName"/>
              </el-form-item>
              <el-form-item label="手机号码" prop="phonenumber">
                <el-input v-model="userInfo.phonenumber"/>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="userInfo.email"/>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <el-radio v-model="userInfo.sex" label="0">男</el-radio>
                <el-radio v-model="userInfo.sex" label="1">女</el-radio>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleUpdateMyInfo">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="second">
            <el-form ref="changeMyPwdForm" :rules="changeMyPwdRules" :model="changeMyPwdModel" label-width="80px">
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input v-model="changeMyPwdModel.oldPassword"/>
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="changeMyPwdModel.newPassword" :minlength="6"/>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPwd">
                <el-input v-model="changeMyPwdModel.confirmPwd"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleChangeMyPwd">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-main>
  </el-container>
</template>
<script>
import { changeSysUserPwd, myProfile, updateMyInfo } from '@/api/system'
export default {
  name: 'UserCenter',
  data() {
    return {
      loading: false,
      postNames: '',
      userInfo: null,
      changeMyPwdModel: { oldPassword: '', newPassword: '', confirmPwd: '' },
      updateMyInfoRules: {
        userName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        phonenumber: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      changeMyPwdRules: {
        oldPassword: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loading = true;
    myProfile().then(res => {
      this.loading = false
      this.userInfo = res.data
    }).catch(ex => {
      this.loading = false
    })
  },
  methods: {
    handleUpdateMyInfo() {
      this.$refs['updateMyInfoForm'].validate((validate) => {
        if (validate) {
          updateMyInfo(this.userInfo).then(res => {
            this.loading = false
            this.$notify({
              message: '操作成功',
              type: 'success'
            })
          }).catch(ex => {
            this.loading = false
          })
        }
      })
    },
    handleChangeMyPwd() {
      this.$refs['changeMyPwdForm'].validate((validate) => {
        if (validate) {
          changeSysUserPwd(this.changeMyPwdModel).then(res => {
            this.loading = false
            this.$notify({
              message: '操作成功',
              type: 'success'
            })
          }).catch(ex => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
