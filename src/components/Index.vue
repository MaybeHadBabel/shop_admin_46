<template>
  <el-container class="index">
  <el-header>Header</el-header>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-main>Main</el-main>
  </el-container>
</el-container>
</template>

<script>
export default {

}
</script>

<style lang='scss'>
.index{
  height: 100%;
  .el-header {
    background-color: #d8d8d8;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-main {
    background-color: #ecf0f1;
  }
}
</style>
