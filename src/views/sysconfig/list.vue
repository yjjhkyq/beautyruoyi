<template>
  <el-container>
    <el-header>
      <el-form :inline="true" :model="listQuery">
        <el-form-item label="参数名称">
          <el-input v-model="listQuery.configName"/>
        </el-form-item>
        <el-form-item label="参数键名">
          <el-input v-model="listQuery.configKey"/>
        </el-form-item>
        <el-form-item label="系统内置">
          <el-select v-model="listQuery.configType">
            <el-option v-for="item in SystemDictDataEnum" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-row>
        <router-link :to="'/system/config/create/'">
          <el-button type="primary">新增</el-button>
        </router-link>
        <el-button type="primary" @click="handleDelete">删除</el-button>
      </el-row>
      <el-row>
        <el-table v-loading="listLoading" :data="list" border highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="configId" label="参数主键" show-overflow-tooltip/>
          <el-table-column prop="configName" label="参数名称" show-overflow-tooltip/>
          <el-table-column prop="configKey" label="参数键名" show-overflow-tooltip/>
          <el-table-column prop="configValue" label="参数键值" show-overflow-tooltip/>
          <el-table-column label="系统内置" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag>{{ getStatus(scope.row.configType) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip/>
          <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip/>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <router-link :to="'/system/config/update/'+scope.row.configId">
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
import { fetchSysConfigList, deleteSysConfig } from '@/api/system'
import { select } from '@/utils/index'
import DictData from '@/constants/dictdata'
export default {
  name: 'SysConfigList',
  data() {
    return {
      list: [],
      listLoading: false,
      SystemDictDataEnum: [],
      listQuery: {
        configName: null,
        configKey: '',
        configType: null
      },
      multiSelections: null
    }
  },
  created() {
    this.SystemDictDataEnum = [{ value: null, label: '所有' }].concat(DictData.SystemDictDataEnum)
    this.listQuery.configType = this.SystemDictDataEnum[0].value
    this.listLoading = true;
    this.search()
  },
  methods: {
    search() {
      this.listLoading = true
      fetchSysConfigList(this.listQuery).then(res => {
        this.list = res.data
        this.listLoading = false
      }).catch(ex => {
        this.listLoading = false
      })
    },
    getStatus(status) {
      for (let index = 0; index < this.SystemDictDataEnum.length; index++) {
        const element = this.SystemDictDataEnum[index]
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
      deleteSysConfig(select(this.multiSelections, 'configId').join(',')).then(res => {
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
