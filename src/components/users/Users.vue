<template>
<div class="users">
  <!-- 面包屑 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 搜索框 -->
  <el-input placeholder="请输入搜索关键字" v-model="query" class="input-with-select">
    <el-button slot="append" icon="el-icon-search" @click='searchUser'></el-button>
  </el-input>
  <!-- 添加用户按钮 -->
  <el-button type='success' plain class="addUserBtn" @click='showDialog'>添加用户</el-button>
  <!-- 用户列表表格 -->
  <el-table
    :data='userList'
    border
    style="width: 100%">
    <el-table-column
      prop="username"
      label="姓名"
      width='180'
    >
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱"
      width='180'
    >
    </el-table-column>
    <el-table-column
      prop="mobile"
      label="电话"
      width='180'>
    </el-table-column>
    <!-- 用户状态 -->

    <el-table-column label="用户状态">
      <template v-slot:default='obj'>
        <el-switch
          @change='changeState(obj.row)'
          v-model='obj.row.mg_state'
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column
      label="操作">
      <template v-slot:default='obj'>
        <el-button type="primary" icon="el-icon-edit" size='small' plain @click='showEditDialog(obj.row)'></el-button>
        <el-button type="danger" icon="el-icon-delete" size='small' plain @click='delUser(obj.row.id)'></el-button>
        <el-button type="success" icon="el-icon-check" size='small' plain @click='assignRole(obj.row)'>分配角色</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pagenum"
    :page-sizes="[2, 4, 6, 8]"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
  <!-- 添加功能对话框 -->
  <el-dialog
  @close='hideDialog'
  title="添加用户"
  :visible.sync="visible"
  width="40%">
    <el-form ref='form' :model='form' :rules='rules' label-width="100px">
      <el-form-item label="用户名" prop='username'>
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop='password'>
        <el-input type='password' v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop='email'>
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop='mobile'>
        <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click='addUser'>确 定</el-button>
    </span>
  </el-dialog>
<!-- 修改功能对话框 -->
  <el-dialog
  title="修改用户"
  :visible.sync="editVisible"
  width="40%">
    <el-form ref='editForm' :model='editForm' :rules='rules' label-width="100px">
      <el-form-item label="用户名">
        <el-tag type='info'>{{ editForm.username }}</el-tag>
      </el-form-item>
      <el-form-item label="邮箱" prop='email'>
        <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop='mobile'>
        <el-input v-model="editForm.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editVisible = false">取 消</el-button>
      <el-button type="primary" @click='update'>确 定</el-button>
    </span>
  </el-dialog>

  <!-- 分配角色功能对话框 -->
  <el-dialog title='分配角色' :visible.sync="assignRoleVisible" width="40%">
    <el-form ref='assignForm' :model='assignForm' label-width='100px'>
      <el-form-item label='用户名'>
        <el-tag type='info'>{{ assignForm.username }}</el-tag>
      </el-form-item>
      <el-form-item label='角色列表'>
        <el-select v-model='assignForm.rid' placeholder='请选择角色'>
          <el-option v-for='item in rolesList' :label='item.roleName' :key='item.id' :value='item.id'></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="assignRoleVisible = false">取 消</el-button>
      <el-button type="primary" @click='assignRoleToUser'>确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
// import axios from 'axios'
export default {
  data () {
    return {
      rolesList: [],
      assignForm: {
        username: '',
        id: '',
        rid: ''
      },
      assignRoleVisible: false,
      query: '',
      pagenum: 1,
      pagesize: 2,
      userList: [],
      total: 0,
      visible: false,
      editVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { message: '请输入邮箱地址', trigger: ['blur', 'change'] },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { message: '请输入手机号', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      try {
        const { meta, data } = await this.$axios.get('users', {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        console.log(data)
        this.total = data.total
        // console.log(this.total)
        if (meta.status === 200) {
          this.userList = data.users
          // console.log(this.userList)
        } else {
          this.$message(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      // 只要修改了每页条数, 数据所在的页码发生了变化了, 回到第一页
      this.pagenum = 1
      this.getUserList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
    async delUser (id) {
      // console.log(id)
      try {
        await this.$confirm('您确定要删除这条数据吗??', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserList()
        } else {
          console.log(meta.msg)
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    searchUser () {
      // 发送搜索的ajax请求, 重新渲染的是当前页
      // 我们无法知道, 搜出来有多少页, 直接渲染当前页不合适的, 很可能会请求到没有数据页码
      // 每次搜索之前, 将页码重置为第一页
      this.pagenum = 1
      this.getUserList()
    },
    async changeState (row) {
      // console.log(row)
      const { meta } = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)
      // console.log(res)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
      } else {
        this.$message.erroe(meta.msg)
      }
    },
    showDialog () {
      this.visible = true
    },
    async addUser () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('users', this.form)
        // console.log(meta)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          // 添加完, 显示到最后一页  16 / 5 => 4页 pagenum = total / pagesize 向上取整
          // this.total 拿的是添加前的来算的
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUserList()
          this.visible = false
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    hideDialog () {
      this.$refs.form.resetFields()
    },
    showEditDialog (row) {
      this.editVisible = true
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },
    async update () {
      try {
        const { id, email, mobile } = this.editForm
        await this.$refs.editForm.validate()
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
        console.log(meta)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.editVisible = false
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async assignRole (row) {
      this.assignRoleVisible = true
      this.assignForm.username = row.username
      this.assignForm.id = row.id
      // 根据用户id获取，发送ajax请求获取角色id
      const res = await this.$axios.get(`users/${row.id}`)
      // console.log(res)
      if (res.meta.status === 200) {
        // rid为-1则表示此用户没有分配角色
        const rid = res.data.rid
        this.assignForm.rid = rid === -1 ? '' : rid
      }
      const { meta, data } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.rolesList = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assignRoleToUser () {
      const { id, rid } = this.assignForm
      // console.log(id, rid)
      if (rid === '') {
        this.$message.error('请选择用户角色')
        return
      }
      const { meta } = await this.$axios.put(`users/${id}/role`, { rid })
      this.$message.success(meta.msg)
      // console.log(res)
      this.assignRoleVisible = false
    }
  }
}
</script>

<style lang='scss' scoped>
.users {
  .el-pagination {
    margin-top: 10px;
  }
  .input-with-select {
    margin-bottom: 10px;
    width: 300px;
  }
  .addUserBtn {
    margin-left: 20px;
  }
}
</style>
