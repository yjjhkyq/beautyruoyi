<template>
  <el-container>
    <el-header>
      <el-form :inline="true" :model="listQuery">
        <el-form-item label="部门名称">
          <el-input v-model="listQuery.deptName"/>
        </el-form-item>
        <el-form-item label="部门状态">
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
        <router-link :to="'/system/dept/create/'" :replace="true">
          <el-button type="primary">新增</el-button>
        </router-link>
        <el-button type="primary" @click="handleDelete">删除</el-button>
      </el-row>
      <el-row>
        <tree-table v-loading="listLoading" ref="dd" :columns="columns" :data="list" border stripe @selection-change="handleSelectionChange">
          <template slot="selection">
            <el-table-column type="selection"/>
          </template>
          <template slot="status" slot-scope="{scope}">
            <el-tag>{{ getStatus(scope.row.status) }}</el-tag>
          </template>
          <template slot="Operation" slot-scope="{scope}">
            <router-link :to="'/system/dept/update/'+ scope.row.deptId">
              <el-button type="primary" size="small" icon="el-icon-edit">Edit</el-button>
            </router-link>
          </template>
        </tree-table>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { fetchSysDeptList, deleteSysDept } from '@/api/system'
import { listToTree } from '@/utils/index'
import treeTable from '@/components/TreeTable'
import DictData from '@/constants/dictdata'
export default {
  name: 'SysDeptList',
  components: { treeTable },
  data() {
    return {
      columns: [
        {
          label: '部门名称',
          key: 'deptName',
          align: 'left',
          expand: true
        },
        {
          label: '排序',
          key: 'orderNum',
          width: 100
        },
        {
          label: '状态',
          key: 'status',
          width: 100
        },
        {
          label: '创建时间',
          key: 'createTime',
          width: 200
        },
        {
          label: '操作',
          key: 'Operation',
          width: 200
        }
      ],
      list: [],
      listLoading: false,
      isEdit: false,
      EnableDisableStatus: [],
      initListQuery: null,
      listQuery: {
        deptName: '',
        status: null
      },
      multiSelections: null,
      rload: true,
      props: { value: 'deptId', label: 'deptName' }
    }
  },
  created() {
    this.EnableDisableStatus = [{ value: null, label: '所有' }].concat(DictData.EnableDisableStatus)
    this.listQuery.status = this.EnableDisableStatus[0].value
    this.initListQuery = { ...this.listQuery }
    this.search()
  },
  methods: {
    search() {
      this.listLoading = true
      fetchSysDeptList(this.listQuery).then(res => {
        if (JSON.stringify(this.initListQuery) === JSON.stringify(this.listQuery)) {
          this.list = listToTree(res.data, 'deptId')
        } else {
          this.list = res.data
        }
        console.log('list data ' + JSON.stringify(this.list))
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
      val.forEach(element => {
        console.log(element.deptId + '  ' + element.parentId + element.deptName)
      });
      this.multiSelections = val;
      console.log(val.length);
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
      deleteSysDept(this.multiSelections[0].deptId).then(res => {
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
