<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type='success' plain class="addRolesBtn" @click='showAddDialog'>添加角色</el-button>
    <el-table
          :data="rolesList"
          style="width: 100%">
      <el-table-column type='expand'>
        <template v-slot:default='{row}'>
          <el-row v-for='l1 in row.children' :key='l1.id'>
            <el-col :span='4' v-if='row.children.length > 0'>
              <el-tag type='primary' closable @close='delRight(row, l1.id)'>{{ l1.authName }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span='20'>
              <el-row v-for='l2 in l1.children' :key='l2.id'>
                <el-col :span='4'>
                  <el-tag type='success' closable @close='delRight(row, l2.id)'>{{ l2.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span='20'>
                  <el-tag v-for='l3 in l2.children' :key='l3.id' type='warning' closable @close='delRight(row, l3.id)'>{{ l3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <p v-if='row.children.length === 0'>暂无权限</p>
        </template>
      </el-table-column>
      <el-table-column
          type='index'
          label="#">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="描述">
      </el-table-column>
      <el-table-column
        label="操作">
        <!-- {{row}}是直接将row从obj中结构赋值出来的 -->
        <template v-slot:default='obj'>
          <el-button type="primary" icon="el-icon-edit" size='small' plain @click='showEditDialog(obj.row)'></el-button>
          <el-button type="danger" icon="el-icon-delete" size='small' plain @click='delRole(obj.row, $event)'></el-button>
          <el-button type="success" icon="el-icon-check" size='small' plain @click='showAssignDialog(obj.row)'>分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignVisible"
      width="40%">
      <el-tree ref='tree' :data="data" :props="defaultProps" show-checkbox default-expand-all node-key='id'></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button type="primary" @click='assignRights'>确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加和修改功能的对话框 -->
    <el-dialog
      @close='resetForm'
      :title="editDialogTitle"
      :visible.sync="editVisible"
      width="40%">
      <el-form ref='form' :model='form' :rules='rules'>
        <el-form-item label="角色名称" label-width='80px' prop='roleName'>
          <el-input placeholder="请输入角色名称" v-model='form.roleName'></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width='80px' prop='roleDesc'>
          <el-input placeholder="请输入角色描述" v-model='form.roleDesc'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      editDialogTitle: '添加角色',
      editVisible: false,
      roleId: '',
      assignVisible: false,
      rolesList: [],
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      form: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data, meta } = await this.$axios.get('roles')
      // console.log(data)
      if (meta.status === 200) {
        // console.log(data)
        this.rolesList = data
      } else {
        console.log(meta.msg)
      }
    },
    async delRight (row, rightId) {
      // console.log(row.id, rightId)
      const { meta, data } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      // console.log(res)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
      // getrolesList()是重新渲染整个页面，不太合适，此处只要重新渲染当前取消权限对应的角色的children即可，由于双向数据绑定，数据变化，视图也会改变
      row.children = data
    },
    async showAssignDialog (row) {
      this.roleId = row.id
      this.assignVisible = true
      // 打开对话框的同时发送ajax请求，获取所有权限列表数据，渲染到对话框
      const { meta, data } = await this.$axios.get('rights/tree')
      // console.log(res)
      if (meta.status === 200) {
        this.data = data
        const ids = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              ids.push(l3.id)
            })
          })
        })
        // 通过key来获取和设置
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assignRights () {
      const ids = this.$refs.tree.getCheckedKeys()
      const halfIds = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...ids, ...halfIds].join(',')
      // console.log(rids)
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      // console.log(res)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.assignVisible = false
        this.getRolesList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delRole (row, e) {
      console.log(row.id)
      // e.target 可以拿到点击的事件源, 点击的到底是哪个元素
      // console.log(e.target)
      // console.log(e.target.nodeName)  节点名称
      if (e.target.nodeName === 'BUTTON') {
        e.target.blur()
      } else {
        // 说明点到了button的子元素
        e.target.parentNode.blur()
      }
      try {
        await this.$confirm('亲，你确定要删除吗？', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`roles/${row.id}`)
        // console.log(meta)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getRolesList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    showEditDialog (row) {
      this.editVisible = true
      this.editDialogTitle = '修改角色'
      this.$nextTick(() => {
        this.form.id = row.id
        this.form.roleName = row.roleName
        this.form.roleDesc = row.roleDesc
      })
    },
    showAddDialog () {
      this.editVisible = true
      this.editDialogTitle = '添加角色'
    },
    resetForm () {
      this.form.id = ''
      this.$refs.form.resetFields()
    },
    async editRoles () {
      try {
        await this.$refs.form.validate()
        const isAdd = this.editDialogTitle === '添加角色'
        const url = isAdd ? 'roles' : `roles/${this.form.id}`
        const method = isAdd ? 'post' : 'put'
        console.log(isAdd, url, method)
        const { meta } = await this.$axios[method](url, this.form)
        console.log(meta)
        if (meta.status === 201 || meta.status === 200) {
          this.$message.success('恭喜！操作成功 ~')
          this.editVisible = false
          this.getRolesList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang='scss'>
.roles {
  .addRolesBtn {
    margin-bottom: 10px;
  }
  .el-row {
    margin-bottom: 5px;
  }
  .el-tag {
    margin-bottom: 5px;
    margin-right: 5px;
  }
  .el-checkbox__inner {
    margin-right: 5px;
  }
}
</style>
