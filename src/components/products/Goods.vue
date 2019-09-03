<template>
  <div class="goods">
    <el-button type='success' class="addBtn" plain @click="goAdd">添加商品</el-button>
    <el-table
      class="goodslist"
      :data="goodsList"
      style="width: 100%">
      <el-table-column type='index'>
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template v-slot:default='{ row }'>
          {{ row.add_time | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <el-button class="el-icon-edit" size='small' type='primary' plain></el-button>
        <el-button class="el-icon-delete" size='small' type='danger' plain></el-button>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 5,
      total: 100
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { meta, data } = await this.$axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      console.log(meta, data)
      if (meta.status === 200) {
        this.goodsList = data.goods
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getGoodsList()
    },
    goAdd () {
      this.$router.push('/goods-add')
    }
  }
}
</script>

<style lang='scss' scoped>
.goods {
  .addBtn {
    margin-bottom: 10px;
  }
  .goodslist {
    margin-bottom: 10px;
  }
}
</style>
