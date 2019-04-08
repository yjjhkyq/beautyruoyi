<template>
  <el-container>
    <el-header>
      <el-form :inline="true" :model="listQuery">
        <el-form-item label="岗位编码">
          <el-input v-model="listQuery.postCode"/>
        </el-form-item>
        <el-form-item label="岗位名称">
          <el-input v-model="listQuery.postName"/>
        </el-form-item>
        <el-form-item label="岗位状态">
          <el-select v-model="listQuery.status">
            <el-option v-for="item in EnableDisableStatus" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-row>
        <router-link :to="'/system/post/create/'">
          <el-button type="primary">新增</el-button>
        </router-link>
        <el-button type="primary" @click="handleDelete">删除</el-button>
      </el-row>
      <el-row>
        <el-table v-loading="listLoading" :data="list" border highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="postId" label="岗位编号" show-overflow-tooltip/>
          <el-table-column prop="postCode" label="岗位编码" show-overflow-tooltip/>
          <el-table-column prop="postName" label="岗位名称" show-overflow-tooltip/>
          <el-table-column prop="postSort" label="显示顺序" show-overflow-tooltip/>
          <el-table-column align="center" label="状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag>{{ getStatus(scope.row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip/>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <router-link :to="'/system/post/update/'+scope.row.postId">
                <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="total" :page.sync="page.page" :limit.sync="page.limit" @pagination="search" />
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { fetchSysPostList, deleteSysPost } from '@/api/system'
import { listToTree, select } from '@/utils/index'
import DictData from '@/constants/dictdata'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'SysPostList',
  components: { Pagination },
  data() {
    return {
      list: [],
      listLoading: false,
      EnableDisableStatus: [],
      listQuery: {
        postCode: '',
        postName: '',
        status: null
      },
      page: { page: 1, limit: 20 },
      multiSelections: null,
      total: 0
    }
  },
  created() {
    this.EnableDisableStatus = [{ value: null, label: '所有' }].concat(DictData.EnableDisableStatus)
    this.listQuery.status = this.EnableDisableStatus[0].value
    this.search()
  },
  methods: {
    search() {
      this.listLoading = true
      fetchSysPostList(this.page, this.listQuery).then(res => {
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
    handleDelete() {
      if (this.multiSelections === null || this.multiSelections.length === 0) {
        this.$notify({
          message: '请选择删除项',
          type: 'warning'
        })
        return;
      }
      this.listLoading = true;
      deleteSysPost(select(this.multiSelections, 'postId').join(',')).then(res => {
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
