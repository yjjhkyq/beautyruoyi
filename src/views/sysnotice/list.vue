<template>
  <el-container>
    <el-header>
      <el-form :inline="true" :model="listQuery">
        <el-form-item label="公告标题">
          <el-input v-model="listQuery.noticeTitle"/>
        </el-form-item>
        <el-form-item label="操作人员">
          <el-input v-model="listQuery.createBy"/>
        </el-form-item>
        <el-form-item label="公告类型">
          <el-select v-model="listQuery.noticeType">
            <el-option v-for="item in NoticeTypeEnum" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-row>
        <router-link :to="'/system/notice/create/'">
          <el-button type="primary">新增</el-button>
        </router-link>
        <el-button type="primary" @click="handleDelete">删除</el-button>
      </el-row>
      <el-row>
        <el-table v-loading="listLoading" :data="list" border highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="noticeId" label="公告ID" show-overflow-tooltip/>
          <el-table-column prop="noticeTitle" label="公告标题" show-overflow-tooltip/>
          <el-table-column label="公告类型" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag>{{ getNoticeTypeLabel(scope.row.noticeType) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag>{{ getStatus(scope.row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createBy" label="创建者" show-overflow-tooltip/>
          <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip/>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <router-link :to="'/system/notice/update/'+scope.row.noticeId">
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
import { fetchSysDictDataBy, fetchSysNoticeList, deleteSysNotice } from '@/api/system'
import { select } from '@/utils/index'
import DictData from '@/constants/dictdata'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'SysNoticeList',
  components: { Pagination },
  data() {
    return {
      list: [],
      listLoading: false,
      EnableDisableStatus: [],
      NoticeTypeEnum: [],
      listQuery: {
        noticeTitle: '',
        createBy: '',
        noticeType: null
      },
      page: { page: 1, limit: 20 },
      multiSelections: null,
      total: 0
    }
  },
  created() {
    this.EnableDisableStatus = [{ value: null, label: '所有' }].concat(DictData.EnableDisableStatus)
    this.listLoading = true
    fetchSysDictDataBy({ dictType: DictData.DictTypes.sys_notice_type }).then(res => {
      this.NoticeTypeEnum = [{ dictValue: null, dictLabel: '所有' }].concat(res.data);
      this.listQuery.noticeType = this.NoticeTypeEnum[0].dictValue
      this.search();
    }).catch(ex => {
      this.listLoading = false
    })
  },
  methods: {
    search() {
      this.listLoading = true
      fetchSysNoticeList(this.page, this.listQuery).then(res => {
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
        console.log(element.value + '  ' + status + '  ' + element.label)
        if (element.value === status) {
          console.log('equal' + element.value + '  ' + status + '  ' + element.label)
          return element.label
        }
      }
      return ''
    },
    getNoticeTypeLabel(value) {
      for (let index = 0; index < this.NoticeTypeEnum.length; index++) {
        const element = this.NoticeTypeEnum[index];
        if (element.dictValue === value) {
          return element.dictLabel;
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
      deleteSysNotice(select(this.multiSelections, 'noticeId').join(',')).then(res => {
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
