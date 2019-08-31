<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
  }
  html,body,#app {
    width: 100%;
    height: 100%;
  }
  #app {
    .el-breadcrumb {
    margin-bottom: 10px;
    border-bottom: 1px solid #C5C5C5;
    height: 40px;
    line-height: 40px;
  }
  }
</style>
