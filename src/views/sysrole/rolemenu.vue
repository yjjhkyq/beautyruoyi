<template>
  <el-container>
    <el-header>
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="handleSetRoleMenu">保存</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main v-loading="listLoading">
      <el-row>
        <el-tree
          ref="menuTree"
          :props="props"
          :data="menuTree"
          :default-checked-keys="checkedMenus"
          node-key="menuId"
          show-checkbox>
          <span slot-scope="{ node, data }">
            <span>{{ data.menuName }}</span>
            <span>{{ data.perms }} </span>
          </span>
        </el-tree>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { fetchSysMenuByRoldId, setRoleMenu, fetchSysMenuList } from '@/api/system'
import { listToTree, select } from '@/utils/index'
export default {
  name: 'RoleMenuList',
  data() {
    return {
      menus: [],
      menuTree: [],
      checkedMenus: [],
      roleId: 0,
      props: {
        children: 'children',
        label: 'menuName'
      }
    }
  },
  created() {
    this.roleId = this.$route.params && this.$route.params.id
    this.listLoading = true
    Promise.all([fetchSysMenuByRoldId(this.roleId), fetchSysMenuList({})]).then(res => {
      if (res[0].data !== null && res[0].data.length > 0) {
        this.checkedMenus = select(res[0].data, 'menuId')
        console.log('checked menus' + JSON.stringify(this.checkedMenus))
      }
      if (res[1].data !== null && res[1].data.length > 0) {
        this.menuTree = listToTree(res[1].data, 'menuId')
      }
      this.listLoading = false
    }).catch(ex => {
      this.listLoading = false
    })
  },
  methods: {
    handleSetRoleMenu() {
      this.listLoading = true
      const menus = []
      const checkecNodes = this.$refs.menuTree.getCheckedNodes();
      checkecNodes.forEach(element => {
        menus.push({ menuId: element.menuId })
      });
      console.log('checked menus' + JSON.stringify(menus))
      setRoleMenu(this.roleId, menus).then(res => {
        this.$notify({
          message: '操作成功',
          type: 'success'
        })
        this.$store.dispatch('delView', this.$route).then(res => {
          this.$router.push('/system/role/list')
        });
        this.listLoading = false
      }).catch(ex => {
        this.listLoading = false
      })
    }
  }
}
</script>
