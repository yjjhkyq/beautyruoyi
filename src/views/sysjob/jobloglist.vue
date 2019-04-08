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
        <el-form-item label="执行状态">
          <el-select v-model="listQuery.status">
            <el-option v-for="item in JobExeStatus" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue"/>
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间">
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
        <el-button type="primary" @click="handleDelete">删除</el-button>
        <el-button type="primary" @click="handleClean">清空</el-button>
      </el-row>
      <el-row>
        <el-table v-loading="listLoading" :data="list" border highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="jobLogId" label="日志编号"/>
          <el-table-column prop="jobName" label="任务名称"/>
          <el-table-column prop="methodName" label="方法名称"/>
          <el-table-column prop="methodParams" label="方法参数"/>
          <el-table-column prop="jobMessage" label="日志信息"/>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <el-tag>{{ getDictDataLabel(JobExeStatus, scope.row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间"/>
        </el-table>
        <pagination :total="total" :page.sync="page.page" :limit.sync="page.limit" @pagination="search" />
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { fetchSysDictDataBy, fetchSysJobLogList, deleteSysJobLog, cleanSysJobLog } from '@/api/system'
import DictData from '@/constants/dictdata'
import { select, getDictDataLabel } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'JobLogList',
  components: { Pagination },
  data() {
    return {
      list: [],
      listLoading: false,
      JobExeStatus: [],
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
    this.JobExeStatus = [{ dictValue: null, dictLabel: '所有' }]
    this.listQuery.status = this.JobExeStatus[0].dictValue
    this.listLoading = true
    try {
      Promise.all([fetchSysDictDataBy({ dictType: DictData.DictTypes.sys_job_exe_status })]).then(res => {
        console.log('ddddddddddddd')
        this.JobExeStatus = this.JobExeStatus.concat(res[0].data)
        this.search()
      }).catch(ex => {
        console.log('ex:' + JSON.stringify(ex))
        this.listLoading = false;
      })
    } catch (ex) {
      console.log('ex' + JSON.stringify(ex))
    }
  },
  methods: {
    getDictDataLabel: getDictDataLabel,
    search() {
      this.listLoading = true
      fetchSysJobLogList(this.page, this.listQuery).then(res => {
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
    handleClean() {
      this.listLoading = true
      cleanSysJobLog().then(res => {
        this.search()
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
      deleteSysJobLog(select(this.multiSelections, 'jobLogId').join(',')).then(res => {
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
