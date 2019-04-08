<template>
  <el-container>
    <el-header>
      <el-form :inline="true" :model="listQuery">
        <el-form-item label="字典名称">
          <el-select v-model="listQuery.dictType">
            <el-option v-for="item in DictTypes" :key="item.dictType" :label="item.dictName" :value="item.dictType"/>
          </el-select>
        </el-form-item>
        <el-form-item label="字典标签">
          <el-input v-model="listQuery.dictLabel"/>
        </el-form-item>
        <el-form-item label="数据状态">
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
        <router-link :to="'/system/dict/data/create/' + listQuery.dictType">
          <el-button type="primary">新增</el-button>
        </router-link>
        <el-button type="primary" @click="handleDelete">删除</el-button>
      </el-row>
      <el-row>
        <el-table v-loading="listLoading" :data="list" border highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="dictCode" label="字典编码" show-overflow-tooltip/>
          <el-table-column prop="dictLabel" label="字典标签" show-overflow-tooltip/>
          <el-table-column prop="dictValue" label="字典键值" show-overflow-tooltip/>
          <el-table-column prop="dictSort" label="字典排序" show-overflow-tooltip/>
          <el-table-column label="状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag>{{ getStatus(scope.row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip/>
          <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip/>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <router-link :to="'/system/dict/data/update/'+scope.row.dictCode">
                <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { fetchSysDictList, fetchSysDictDataList, deleteSysDictData } from '@/api/system'
import { select } from '@/utils/index'
import DictData from '@/constants/dictdata'
export default {
  name: 'SysDictDataList',
  data() {
    return {
      total: 0,
      list: [],
      listLoading: false,
      EnableDisableStatus: [],
      listQuery: {
        dictType: null,
        dictLabel: '',
        status: null
      },
      multiSelections: null,
      DictTypes: []
    }
  },
  created() {
    this.EnableDisableStatus = [{ value: null, label: '所有' }].concat(DictData.EnableDisableStatus)
    this.listQuery.status = this.EnableDisableStatus[0].value
    this.listLoading = true;
    fetchSysDictList({ page: 1, limit: 1000000 }, { status: DictData.EnableStatus.Enable }).then(res => {
      this.DictTypes = res.data.records;
      const dictType = this.$route.params && this.$route.params.dictType;
      if (dictType) {
        this.listQuery.dictType = dictType
      } else {
        this.listQuery.dictType = this.DictTypes[0].dictType;
      }
      this.search()
    }).catch(ex => {
      this.listLoading = false
    })
  },
  methods: {
    search() {
      this.listLoading = true
      fetchSysDictDataList(this.listQuery).then(res => {
        this.list = res.data
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
      deleteSysDictData(select(this.multiSelections, 'dictCode').join(',')).then(res => {
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
