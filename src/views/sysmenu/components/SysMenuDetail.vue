<template>
  <el-container>
    <el-header>
      <el-button type="primary" @click="save('form', false)">保存</el-button>
      <el-button v-if="isEdit !== true" type="primary" @click="save('form', true)">保存&继续</el-button>
    </el-header>
    <el-main>
      <el-form v-loading="loading" ref="form" :rules="rules" :model="createEditModel" label-width="80px">
        <el-form-item label="上级菜单">
          <el-cascader :options="MenuTree" v-model="createEditModel.ancestors" :props="props" change-on-select />
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-select v-model="createEditModel.menuType">
            <el-option v-for="item in MenuTypes" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue"/>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="createEditModel.menuName"/>
        </el-form-item>
        <el-form-item label="请求地址" prop="url">
          <el-input v-model="createEditModel.url"/>
        </el-form-item>
        <el-form-item label="权限标识" prop="perms">
          <el-input v-model="createEditModel.perms"/>
        </el-form-item>
        <el-form-item label="显示顺序">
          <el-input-number v-model="createEditModel.orderNum" :min="0"/>
        </el-form-item>
        <el-form-item label="菜单状态：">
          <el-select v-model="createEditModel.visible">
            <el-option v-for="item in MenuStatus" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue"/>
          </el-select>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
import DictData from '@/constants/dictdata'
import { fetchSysMenuList, fetchSysMenuBy, createUpdateSysMenu, fetchSysDictDataByDictType } from '@/api/system'
import { listToTree, getAncestors } from '@/utils/index'
const defaultForm = {
  menuId: 0,
  parentId: 0,
  menuType: '',
  menuName: '',
  url: '',
  perms: '',
  ancestors: [],
  orderNum: 0,
  status: ''
};
export default {
  name: 'SysMenuDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      createEditModel: Object.assign({}, defaultForm),
      loading: false,
      MenuTree: [],
      MenuTypes: [],
      menus: [],
      MenuStatus: [],
      rules: {
        menuName: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      props: { value: 'menuId', label: 'menuName' }
    }
  },
  created() {
    this.loading = true
    Promise.all([fetchSysDictDataByDictType(DictData.DictTypes.sys_menu_type),
      fetchSysDictDataByDictType(DictData.DictTypes.sys_show_hide), fetchSysMenuList({})]).then(res => {
      this.MenuTypes = res[0].data
      this.MenuStatus = res[1].data
      this.menus = res[2].data
      this.MenuTree = listToTree(this.menus, 'menuId')
      this.createEditModel = Object.assign({}, defaultForm)
      this.createEditModel.menuType = this.MenuTypes[0].dictValue
      this.createEditModel.status = this.MenuStatus[0].dictValue
      console.log('create edit model' + JSON.stringify(this.createEditModel))
      if (this.isEdit === true) {
        const id = this.$route.params && this.$route.params.id
        fetchSysMenuBy({ menuId: id }).then(res => {
          this.createEditModel = res.data
          if (this.createEditModel.menuId !== 0) {
            console.log('ancestors:' + JSON.stringify(this.ancestors))
            this.createEditModel.ancestors = getAncestors(this.menus, this.createEditModel.menuId, 'menuId', 'parentId')
            console.log('11create edit model:' + JSON.stringify(this.createEditModel))
          }
          console.log('create edit model:' + JSON.stringify(this.createEditModel))
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      } else {
        this.loading = false
      }
    }).catch(ex => {
      this.loading = false
    });
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    // this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    save(formName, continueEdit) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          var postData = Object.assign({}, this.createEditModel)
          if (postData.ancestors === null || postData.ancestors.length === 0) {
            postData.parentId = 0
          } else {
            postData.parentId = postData.ancestors[postData.ancestors.length - 1]
          }
          createUpdateSysMenu(postData).then(res => {
            console.log('create dept success');
            this.loading = false
            this.$notify({
              message: '操作成功',
              type: 'success'
            });
            if (continueEdit === true) {
              this.createEditModel = Object.assign({}, defaultForm)
            } else {
              this.$store.dispatch('delView', this.$route).then(res => {
                this.$router.push('/system/menu/list')
              });
            }
          }).catch(ex => {
            console.log('create dept error');
            this.loading = false
          })
        }
      });
    }
  }
}
</script>
