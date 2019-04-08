<template>
  <el-container>
    <el-header :height="'120'">
      <el-form :inline="true" :model="listQuery">
        <el-form-item label="部门">
          <el-cascader :options="deptTree" v-model="listQuery.ancestors" :props="props" change-on-select/>
        </el-form-item>
        <el-form-item label="登录名称">
          <el-input v-model="listQuery.loginName"/>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="listQuery.phonenumber"/>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select v-model="listQuery.status">
            <el-option v-for="item in EnableDisableStatus" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="listQuery.params['beginTime']" type="date" placeholder="开始时间"/>
          <span>-</span>
          <el-date-picker v-model="listQuery.params['endTime']" type="date" placeholder="结束时间"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-row>
        <router-link :to="'/system/user/create/'">
          <el-button type="primary">新增</el-button>
        </router-link>
        <el-button type="primary" @click="handleDelete">删除</el-button>
      </el-row>
      <el-row>
        <el-table v-loading="listLoading" :data="list" border highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="userId" label="用户ID"/>
          <el-table-column prop="loginName" label="登录名称"/>
          <el-table-column prop="userName" label="用户名称"/>
          <el-table-column prop="dept.deptName" label="部门"/>
          <el-table-column prop="phonenumber" label="手机"/>
          <el-table-column prop="status" label="用户状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="0"
                :inactive-value="1"
                @change="value => handleStatusChange(scope.row, value)"/>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间"/>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <router-link :to="'/system/user/update/'+scope.row.userId">
                <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
              </router-link>
              <el-button type="primary" @click="handleResetPwd(scope.row)">重置</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="total" :page.sync="page.page" :limit.sync="page.limit" @pagination="search" />
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { fetchSysUserList, deleteSysUser, changeSysUserStatus, resetSysUserPwd, fetchSysDeptList } from '@/api/system'
import DictData from '@/constants/dictdata'
import { select, listToTree } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'SysUserList',
  components: { Pagination },
  data() {
    return {
      list: [],
      listLoading: false,
      EnableDisableStatus: [],
      listQuery: {
        ancestors: [],
        loginName: '',
        phonenumber: '',
        status: null,
        params: { 'beginTime': null, 'endTime': null }
      },
      page: { page: 1, limit: 20 },
      multiSelections: null,
      total: 0,
      props: { value: 'deptId', label: 'deptName' },
      deptTree: []
    }
  },
  created() {
    this.EnableDisableStatus = [{ value: null, label: '所有' }].concat(DictData.EnableDisableStatus)
    this.listQuery.status = this.EnableDisableStatus[0].value
    this.listLoading = true
    fetchSysDeptList({}).then(res => {
      this.deptTree = listToTree(res.data, 'deptId')
      this.search()
    }).catch(ex => {
      this.listLoading = false
    })
  },
  methods: {
    search() {
      this.listLoading = true
      if (this.listQuery.ancestors !== null && this.listQuery.ancestors.length > 0) {
        this.listQuery.deptId = this.listQuery.ancestors[this.listQuery.ancestors.length - 1]
      } else {
        this.listQuery.deptId = null
      }
      fetchSysUserList(this.page, this.listQuery).then(res => {
        this.total = res.data.total
        this.list = res.data.records
        this.listLoading = false
      }).catch(ex => {
        this.listLoading = false
      })
    },
    getStatus(status) {
      for (let index = 0; index < this.EnableDisableStatus.length; index++) {
        const element = this.EnableDisableStatus[index]
        if (element.value === status) {
          return element.label
        }
      }
      return ''
    },
    handleSearch() {
      this.page.page = 1;
      this.search();
    },
    handleSelectionChange(val) {
      this.multiSelections = val;
    },
    handleStatusChange(data) {
      this.listLoading = true
      changeSysUserStatus(data).then(res => {
        this.$notify({
          message: '操作成功',
          type: 'success'
        })
        this.listLoading = false
      }).catch(ex => {
        this.listLoading = false
      })
    },
    handleResetPwd(row) {
      this.listLoading = true
      resetSysUserPwd(row).then(res => {
        this.$notify({
          message: '操作成功',
          type: 'success'
        })
        this.listLoading = false
      }).catch(ex => {
        this.listLoading = false
      })
    },
    handleDelete() {
      if (this.multiSelections === null || this.multiSelections.length === 0) {
        this.$notify({
          message: '请选择删除项',
          type: 'warning'
        })
        return;
      }
      this.listLoading = true;
      deleteSysUser(select(this.multiSelections, 'userId').join(',')).then(res => {
        this.search();
        this.listLoading = false
      }).catch(ex => {
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
