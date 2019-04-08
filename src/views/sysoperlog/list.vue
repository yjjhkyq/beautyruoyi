<template>
  <el-container>
    <el-header :height="'120'">
      <el-form :inline="true" :model="listQuery">
        <el-form-item label="系统模块">
          <el-input v-model="listQuery.title"/>
        </el-form-item>
        <el-form-item label="操作人员">
          <el-input v-model="listQuery.operName"/>
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="listQuery.businessType">
            <el-option v-for="item in BusinessTypes" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue"/>
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
          <el-table-column prop="operId" label="日志编号"/>
          <el-table-column prop="title" label="系统模块"/>
          <el-table-column prop="businessType" label="操作类型">
            <template slot-scope="scope">
              <el-tag>{{ getBusinessTypeLabel(scope.row.businessType) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="operName" label="操作人员"/>
          <el-table-column prop="deptName" label="部门名称"/>
          <el-table-column prop="operIp" label="主机"/>
          <el-table-column prop="operLocation" label="操作地点"/>
          <el-table-column prop="status" label="操作状态">
            <template slot-scope="scope">
              <el-tag>{{ getStatusLabel(scope.row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="operTime" label="操作时间"/>
          <el-table-column label="操作" >
            <template slot-scope="scope">
              <el-button type="primary" @click="handleDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="total" :page.sync="page.page" :limit.sync="page.limit" @pagination="search" />
      </el-row>
    </el-main>
    <el-dialog :visible.sync="dialogVisible" title="操作日志详细" width="80%" >
      <el-form ref="form" :model="detailModel" label-width="80px">
        <el-form-item label="操作模块">
          <span>{{ detailModel.title }}/{{ getBusinessTypeLabel(detailModel.businessType) }}</span>
        </el-form-item>
        <el-form-item label="登录信息">
          <span>{{ detailModel.operName }}/{{ detailModel.deptName }}/{{ detailModel.operIp }}</span>
        </el-form-item>
        <el-form-item label="请求地址">
          <span>{{ detailModel.operUrl }}</span>
        </el-form-item>
        <el-form-item label="操作方法">
          <span>{{ detailModel.method }}</span>
        </el-form-item>
        <el-form-item label="请求参数">
          <input :rows="2" v-model="detailModel.operParam" type="textarea" readonly>
        </el-form-item>
        <el-form-item label="状态">
          <el-tag>{{ getStatusLabel(detailModel.status) }}</el-tag>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { fetchSysDictDataBy, fetchSysOperLogList, deleteSysOperLog, fetchSysOperLogBy, cleanSysOperLog } from '@/api/system'
import DictData from '@/constants/dictdata'
import { select } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'MonitorOperLogList',
  components: { Pagination },
  data() {
    return {
      list: [],
      listLoading: false,
      dialogVisible: false,
      Status: [],
      BusinessTypes: [],
      detailModel: {},
      listQuery: {
        title: '',
        operName: '',
        businessType: null,
        params: { 'beginTime': null, 'endTime': null }
      },
      page: { page: 1, limit: 20 },
      multiSelections: null,
      total: 0
    }
  },
  created() {
    this.Status = [{ dictValue: null, dictLabel: '所有' }]
    this.BusinessTypes =  [{ dictValue: null, dictLabel: '所有' }]
    this.listQuery.status = this.Status[0].value
    this.listLoading = true
    try {
      Promise.all([fetchSysDictDataBy({ dictType: DictData.DictTypes.sys_oper_type }),
        fetchSysDictDataBy({ dictType: DictData.DictTypes.sys_oper_status })]).then(res => {
        console.log('ddddddddddddd')
        this.BusinessTypes = this.BusinessTypes.concat(res[0].data)
        this.Status = this.Status.concat(res[1].data)
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
    search() {
      this.listLoading = true
      fetchSysOperLogList(this.page, this.listQuery).then(res => {
        this.total = res.data.total
        this.list = res.data.records
        this.listLoading = false
      }).catch(ex => {
        this.listLoading = false
      })
    },
    getStatusLabel(status) {
      for (let index = 0; index < this.Status.length; index++) {
        const element = this.Status[index]
        if (element.dictValue === status) {
          return element.dictLabel
        }
      }
      return ''
    },
    getBusinessTypeLabel(status) {
      console.log(status + '')
      for (let index = 0; index < this.BusinessTypes.length; index++) {
        const element = this.BusinessTypes[index]
        if (element.dictValue === status) {
          return element.dictLabel
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
    handleDetail(row) {
      this.detailModel = row
      this.dialogVisible = true
    },
    handleClean() {
      this.listLoading = true
      cleanSysOperLog().then(res => {
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
      deleteSysOperLog(select(this.multiSelections, 'operId').join(',')).then(res => {
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
