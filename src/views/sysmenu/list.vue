<template>
  <el-container>
    <el-header>
      <el-form :inline="true" :model="listQuery">
        <el-form-item label="菜单名称">
          <el-input v-model="listQuery.menuName"/>
        </el-form-item>
        <el-form-item label="请求地址">
          <el-input v-model="listQuery.url"/>
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="listQuery.perms"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-row>
        <router-link :to="'/system/menu/create/'">
          <el-button type="primary">新增</el-button>
        </router-link>
        <el-button type="primary" @click="handleDelete">删除</el-button>
      </el-row>
      <el-row>
        <tree-table v-loading="listLoading" ref="dd" :columns="columns" :data="list" border stripe @selection-change="handleSelectionChange">
          <template slot="selection">
            <el-table-column type="selection"/>
          </template>
          <template slot="menuType" slot-scope="{scope}">
            <el-tag>{{ getMenuTypeLabel(scope.row.menuType) }}</el-tag>
          </template>
          <template slot="visible" slot-scope="{scope}">
            <el-tag>{{ getMenuStatusLabel(scope.row.visible) }}</el-tag>
          </template>
          <template slot="Operation" slot-scope="{scope}">
            <router-link :to="'/system/menu/update/'+ scope.row.menuId">
              <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
            </router-link>
          </template>
        </tree-table>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { fetchSysMenuList, deleteSysMenu, fetchSysDictDataByDictType } from '@/api/system'
import { listToTree } from '@/utils/index'
import treeTable from '@/components/TreeTable'
import DictData from '@/constants/dictdata'
export default {
  name: 'SysMenuList',
  components: { treeTable },
  data() {
    return {
      columns: [
        {
          label: '菜单名称',
          key: 'menuName',
          width: 400,
          align: 'left',
          expand: true
        },
        {
          label: '排序',
          key: 'orderNum',
          width: 100
        },
        {
          label: '请求地址',
          key: 'url'
        },
        {
          label: '类型',
          key: 'menuType'
        },
        {
          label: '可见',
          key: 'visible'
        },
        {
          label: '权限标识',
          key: 'perms'
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
      MenuTypes: [],
      initListQuery: null,
      listQuery: {
        deptName: '',
        status: null
      },
      multiSelections: null,
      rload: true
    }
  },
  created() {
    this.MenuTypes = [{ value: null, label: '所有' }]
    this.MenuStatus = []
    this.initListQuery = { ...this.listQuery }
  },
  mounted() {
    this.listLoading = true
    Promise.all([fetchSysDictDataByDictType(DictData.DictTypes.sys_menu_type),
      fetchSysDictDataByDictType(DictData.DictTypes.sys_show_hide)]).then(res => {
      this.MenuTypes = [this.MenuTypes, ...res[0].data]
      this.MenuStatus = [this.MenuStatus, ...res[1].data]
      this.search()
    }).catch(ex => {
      this.listLoading = false
    });
  },
  methods: {
    search() {
      this.listLoading = true
      fetchSysMenuList(this.listQuery).then(res => {
        if (JSON.stringify(this.initListQuery) === JSON.stringify(this.listQuery)) {
          this.list = listToTree(res.data, 'menuId')
        } else {
          this.list = res.data
        }
        console.log('list data ' + JSON.stringify(this.list))
        this.listLoading = false
      }).catch(ex => {
        this.listLoading = false
      })
    },
    getMenuStatusLabel(status) {
      for (let index = 0; index < this.MenuStatus.length; index++) {
        const element = this.MenuStatus[index]
        if (element.dictValue === status + '') {
          return element.dictLabel
        }
      }
      return ''
    },
    getMenuTypeLabel(status) {
      for (let index = 0; index < this.MenuTypes.length; index++) {
        const element = this.MenuTypes[index]
        if (element.dictValue === status + '') {
          return element.dictLabel
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
      deleteSysMenu(this.multiSelections[0].menuId).then(res => {
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
