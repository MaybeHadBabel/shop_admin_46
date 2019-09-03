<template>
  <div class="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
      <template>
        <el-table
          :data="rightList"
          style="width: 100%">
          <el-table-column
            type='index'
            label="#">
          </el-table-column>
          <el-table-column
            prop="authName"
            label="权限名称">
          </el-table-column>
          <el-table-column
            prop="path"
            label="路径">
          </el-table-column>
          <el-table-column
            label="层级">
            <!-- {{row}}是直接将row从obj中结构赋值出来的 -->
            <template v-slot:default='{ row }'>
              <!-- 后台返回的数据中，level的值是字符串，所以进行全等比较时，值也应为字符串形式 -->
              <p v-if='row.level==="0"'>一级</p>
              <p v-if='row.level==="1"'>二级</p>
              <p v-if='row.level==="2"'>三级</p>
            </template>
          </el-table-column>
        </el-table>
      </template>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      const { data, meta } = await this.$axios.get('rights/list')
      // console.log(data, meta)
      if (meta.status === 200) {
        console.log(meta.msg)
        this.rightList = data
      } else {
        console.log(meta.msg)
      }
    }
  }
}
</script>

<style>
</style>
