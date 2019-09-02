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
      :default-active='defaultUrl'
      unique-opened
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-submenu :index="item.path" v-model='menuList' v-for='item in menuList' :key='item.id'>
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.authName}}</span>
        </template>
        <el-menu-item :index="info.path" v-for='info in item.children' :key='info.id'>
          <i class="el-icon-menu"></i>
          <span slot="title">{{info.authName}}</span>
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
  data () {
    return {
      menuList: []
    }
  },
  async created () {
    const { meta, data } = await this.$axios.get('menus')
    if (meta.status === 200) {
      this.menuList = data
      // console.log(this.$route)
    } else {
      this.$message.error(meta.msg)
    }
  },
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
  },
  computed: {
    defaultUrl () {
      return this.$route.path.slice(1)
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
