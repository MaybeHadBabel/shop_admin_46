<template>
  <div class="goods-add">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description='基本信息'></el-step>
      <el-step title="步骤 2" description='商品图片'></el-step>
      <el-step title="步骤 3" description='商品内容'></el-step>
    </el-steps>
    <el-tabs @tab-click='handleclick' v-model='activeTab' tab-position="left">
      <el-tab-pane name='0' label="基本信息">
        <el-form ref='form' :model='form' label-width="80px">
          <el-form-item label='商品名称'>
            <el-input v-model='form.goods_name' placeholder='请输入商品名称'></el-input>
          </el-form-item>
          <el-form-item label='商品价格'>
            <el-input v-model='form.goods_price' placeholder='请输入商品价格'></el-input>
          </el-form-item>
          <el-form-item label='商品重量'>
            <el-input v-model='form.goods_weight' placeholder='请输入商品重量'></el-input>
          </el-form-item>
          <el-form-item label='商品数量'>
            <el-input v-model='form.goods_number' placeholder='请输入商品数量'></el-input>
          </el-form-item>
          <el-form-item label='商品分类'>
            <el-cascader
            v-model="form.goods_cat"
            :props='props'
            :options="options">
            </el-cascader>
          </el-form-item>
        </el-form>
        <el-button type='primary' @click='next'>下一步</el-button>
      </el-tab-pane>
      <el-tab-pane name='1' label="商品图片">
        <el-upload
          multiple
          :headers='headers'
          name='file'
          :on-success="handleSuccess"
          :on-preview='handlepreview'
          :on-remove="handleRemove"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-button type='primary' @click='next'>下一步</el-button>
      </el-tab-pane>
      <el-tab-pane name='2' label="商品内容">
        <quill-editor v-model="form.goods_introduce">
        </quill-editor>
        <el-button type='primary' @click='goodsAdd'>添加</el-button>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      form: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: []
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeTab: '0',
      headers: {
        Authorization: localStorage.getItem('token')
      },
      dialogImageUrl: '',
      dialogVisible: false
      // rules: {
      //   goods_name: [
      //     { required: true, message: '请输入商品名称' }
      //   ],
      //   goods_price: [
      //     { required: true, message: '请输入价格' }
      //   ],
      //   goods_weight: [
      //     { required: true, message: '请输入重量' }
      //   ],
      //   goods_number: [
      //     { required: true, message: '请输入商品数量' }
      //   ],
      //   goods_cat: [
      //     { required: true, message: '请选择商品分类' }
      //   ]
      // }
    }
  },
  async created () {
    const { meta, data } = await this.$axios.get('categories?type=3')
    // console.log(res)
    if (meta.status === 200) {
      this.options = data
      // console.log(this.options)
    } else {
      this.$message.error(meta.msg)
    }
  },
  methods: {
    handleclick (tab) {
      // console.log(tab)
      this.active = +tab.index
    },
    next () {
      this.active++
      this.activeTab = this.active + ''
    },
    handlepreview (file) {
      // console.log(file)
      this.dialogVisible = true
      this.dialogImageUrl = file.url
    },
    handleSuccess (response, file, fileList) {
      // console.log(response, file, fileList)
      const { meta, data } = response
      if (meta.status === 200) {
        this.form.pics.push({
          pic: data.tmp_path
        })
        console.log(this.form.pics)
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
      this.form.pics = this.form.pics.filter(item => item.pic !== file.response.data.tmp_path)
      console.log(this.form.pics)
    },
    async goodsAdd () {
      const { meta } = await this.$axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join(',')
      })
      if (meta.status === 201) {
        this.$message.success(meta.msg)
        this.$router.push('/goods')
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.goods-add {
  .quill-editor {
    background: #fff;
    ::v-deep .ql-editor {
      min-height: 300px;
    }
  }
}
</style>
