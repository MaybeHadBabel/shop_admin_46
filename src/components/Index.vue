<template>
  <el-container class="index">
  <el-header>
    <div class="logo">
      <img src="../assets/logo.ec55f206.png" alt="">
    </div>
    <div class="title">
      <h1>电商后台管理系统</h1>
    </div>
    <div class="logout">
      <span>欢迎光临~ </span>
      <a href="javascript:;" @click='logout'>退出</a>
    </div>
  </el-header>
  <el-container>
    <el-aside width="200px">
      <el-menu
      router
      unique-opened
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>用户管理</span>
        </template>
        <el-menu-item index="users">
          <i class="el-icon-menu"></i>
          <span slot="title">用户列表</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>权限管理</span>
        </template>
        <el-menu-item index="roles">
          <i class="el-icon-menu"></i>
          <span slot="title">角色列表</span>
        </el-menu-item>
        <el-menu-item index="rights">
          <i class="el-icon-menu"></i>
          <span slot="title">权限列表</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  methods: {
    async logout () {
      try {
        await this.$confirm('亲，确定要退出系统吗？？', '温馨提示', {
          type: 'warning'
        })
        this.$message('成功退出')
        localStorage.removeItem('token')
        this.$router.push('/login')
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.index{
  height: 100%;
  .el-header {
    background-color: #d8d8d8;
    display: flex;
    .logo {
      width: 180px;
      margin: 10px;
      img {
        height: 40px;
      }
    }
    .logout {
      width: 180px;
      text-align: right;
      height: 60px;
      line-height: 60px;
      span {
        font-weight: 700;
      }
      a {
        font-weight: 700;
        color: orange;
      }
    }
    .title {
      flex: 1;
      h1 {
        height: 60px;
        line-height: 60px;
        color: #545c64;
        text-align: center;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #ecf0f1;
  }
}
</style>
