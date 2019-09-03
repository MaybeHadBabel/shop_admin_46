<template>
  <div class="categories">
    <el-button type='success' plain class="addCateBtn" @click='showAdd'>添加分类</el-button>
    <el-table
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      v-loading='loading'
      row-key='cat_id'
      :data="categoriesList"
      style="width: 100%">
      <el-table-column
        prop="cat_name"
        label="分类名称">
      </el-table-column>
      <el-table-column
        label="是否有效">
        <template v-slot:default='{row}'>
          {{ row.cat_delete ? '否' : '是' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_level"
        label="排序">
      </el-table-column>
      <el-table-column
        label="操作">
        <el-button size='small' plain type='primary' class="el-icon-edit"></el-button>
        <el-button size='small' plain type='danger' class="el-icon-delete"></el-button>
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
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form ref='form' :model="form" :rules='rules'>
        <el-form-item label='分类名称' label-width='80px' prop='cat_name'>
          <el-input placeholder='请输入分类名称' v-model="form.cat_name"></el-input>
        </el-form-item>
        <el-form-item label='父级名称' label-width='80px'>
          <el-cascader
            clearable
            placeholder='请选择父级分类'
            v-model="form.cat_pid"
            :options="options"
            :props="props">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='addCategories'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      categoriesList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      loading: false,
      dialogVisible: false,
      options: [],
      props: {
        checkStrictly: true, // 可以只选中一级
        value: 'cat_id', // 用于提交的 id
        label: 'cat_name', // 用于展示的文本
        children: 'children'
      },
      form: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getCategoriesList()
  },
  methods: {
    async getCategoriesList () {
      this.loading = true
      const { meta, data } = await this.$axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // console.log(res)
      if (meta.status === 200) {
        this.categoriesList = data.result
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
      this.loading = false
    },
    handleSizeChange (val) {
      console.log('每页' + val + '条')
      this.pagesize = val
      this.getCategoriesList()
    },
    handleCurrentChange (val) {
      console.log('当前是第' + val + '页')
      this.pagenum = val
      this.getCategoriesList()
    },
    async showAdd () {
      this.dialogVisible = true
      const { meta, data } = await this.$axios.get('categories?type=2', this.form)
      // console.log(res)
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async addCategories () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('categories', {
        // 拿到选中的最后一项的id, 就是父级id
        // 如果没有选, 拿不到最后一项, 给的默认值 0, 如果给的是0, 就表示没有父级
          cat_pid: this.form.cat_pid[this.form.cat_pid.length - 1] || 0,
          cat_name: this.form.cat_name,
          cat_level: this.form.cat_pid.length
        })
        // console.log(res)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.getCategoriesList()
          this.dialogVisible = false
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

<style lang='scss' scoped>
.categories {
  .addCateBtn {
    margin-bottom: 10px;
  }
  .el-table {
    margin-bottom: 10px;
  }
}
</style>
