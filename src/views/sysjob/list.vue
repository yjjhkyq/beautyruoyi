<template>
  <el-container>
    <el-header :height="'120'">
      <el-form :inline="true" :model="listQuery">
        <el-form-item label="任务名称">
          <el-input v-model="listQuery.jobName"/>
        </el-form-item>
        <el-form-item label="方法名称">
          <el-input v-model="listQuery.methodName"/>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="listQuery.status">
            <el-option v-for="item in JobStatus" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-row>
        <router-link :to="'/monitor/job/create/'">
          <el-button type="primary">新增</el-button>
        </router-link>
        <el-button type="primary" @click="handleDelete">删除</el-button>
        <router-link :to="'/monitor/jobLog/list/'">
          <el-button type="primary">日志</el-button>
        </router-link>
      </el-row>
      <el-row>
        <el-table v-loading="listLoading" :data="list" border highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="jobId" label="任务编号"/>
          <el-table-column prop="jobName" label="任务名称"/>
          <el-table-column prop="jobGroup" label="任务组名"/>
          <el-table-column prop="methodName" label="方法名称"/>
          <el-table-column prop="methodParams" label="方法参数"/>
          <el-table-column prop="cronExpression" label="执行表达式"/>
          <el-table-column prop="status" label="任务">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="value => handleStatusChange(scope.row, value)"/>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间"/>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleRun(scope.row)">执行一次</el-button>
              <router-link :to="'/monitor/job/update/'+scope.row.jobId">
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
import { fetchSysDictDataBy, runSysJob, changeSysJobStatus, deleteSysJob, fetchSysJobList  } from '@/api/system'
import { select } from '@/utils/index'
import DictData from '@/constants/dictdata'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'SysDictList',
  components: { Pagination },
  data() {
    return {
      list: [],
      listLoading: false,
      JobStatus: [],
      listQuery: {
        jobName: '',
        methodName: '',
        status: null,
        params: { 'beginTime': null, 'endTime': null }
      },
      page: { page: 1, limit: 20 },
      multiSelections: null,
      total: 0
    }
  },
  created() {
    this.JobStatus = [{ dictValue: null, dictLabel: '所有' }]
    this.listQuery.status = this.JobStatus[0].dictValue
    this.listLoading = true
    fetchSysDictDataBy({ dictType: DictData.DictTypes.sys_job_status }).then(res => {
      this.JobStatus = this.JobStatus.concat(res.data)
      this.search()
    }).catch(ex => {
      this.listLoading = false
    })
    this.search()
  },
  methods: {
    search() {
      this.listLoading = true
      fetchSysJobList(this.page, this.listQuery).then(res => {
        this.total = res.data.total
        this.list = res.data.records
        this.listLoading = false
      }).catch(ex => {
        this.listLoading = false
      })
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
      deleteSysJob(select(this.multiSelections, 'jobId').join(',')).then(res => {
        this.search();
        this.listLoading = false
      }).catch(ex => {
        this.listLoading = false
      })
    },
    handleRun(row) {
      this.listLoading = true;
      runSysJob(row.jobId).then(res => {
        this.$notify({
          message: '操作成功',
          type: 'warning'
        })
        this.listLoading = false
      }).catch(ex => {
        this.listLoading = false
      })
    },
    handleStatusChange(row, value) {
      row.status = value
      this.listLoading = true
      changeSysJobStatus(row).then(res => {
        this.$notify({
          message: '操作成功',
          type: 'warning'
        })
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
