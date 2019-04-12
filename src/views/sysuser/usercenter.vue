<template>
  <el-container v-loading="loading">
    <el-aside width="220px">
      <el-card>
        <div slot="header">
          <span>个人资料</span>
        </div>
        <el-row>
          <el-upload
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :headers="headers"
            class="avatar-uploader">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-row>
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
import { changeSysUserPwd, myProfile, updateMyInfo, getFileUploadUrl, getFileDownloadUrl, updateMyAvatar } from '@/api/system'
import { getTokenHeader } from '@/utils/auth'
export default {
  name: 'UserCenter',
  data() {
    return {
      loading: false,
      postNames: '',
      userInfo: { dept: {}},
      uploadUrl: getFileUploadUrl(),
      headers: { ...getTokenHeader() },
      imageUrl: '',
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
      this.imageUrl = getFileDownloadUrl(this.userInfo.avatar)
      console.log(this.imageUrl)
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
    },
    handleAvatarSuccess(response) {
      console.log(response.data + 'file id')
      this.loading = true
      this.userInfo.avatar = response.data
      this.imageUrl = getFileDownloadUrl(response.data)
      if (this.userInfo.userId > 0) {
        updateMyAvatar(this.userInfo).then(res => {
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      }
    }
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
