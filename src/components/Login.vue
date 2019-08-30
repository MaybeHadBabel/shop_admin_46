<template>
  <div class="login">
    <el-form ref="form" :model="form" label-width="80px" :rules='rules' status-icon>
      <img src="../assets/timg.jpg" alt="">
      <el-form-item label="用户名" prop='username'>
        <el-input v-model="form.username" placeholder='请输入用户名' @keyup.enter.native='login'></el-input>
      </el-form-item>
      <el-form-item label="密码" prop='password'>
        <el-input type='password' v-model="form.password" placeholder='请输入密码' @keyup.enter.native='login'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' class="loginBtn" @click='login'>登录</el-button>
        <el-button @click='resetForm'>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      this.$refs.form.resetFields()
    },
    // login () {
    //   this.$refs.form.validate(valid => {
    //     if (!valid) return
    //     this.$axios.post('login', this.form).then(res => {
    //       console.log(res)
    //       const { meta, data } = res
    //       if (meta.status === 200) {
    //         localStorage.setItem('token', data.token)
    //         this.$router.push('/index')
    //         this.$message({
    //           message: meta.msg,
    //           duration: 1000,
    //           type: 'success'
    //         })
    //       } else {
    //         this.$message({
    //           message: meta.msg,
    //           duration: 1000
    //         })
    //       }
    //     })
    //   })
    // },
    async login () {
      try {
        await this.$refs.form.validate()
        // 校验通过，发送ajax请求
        const { meta, data } = await this.$axios.post('login', this.form)
        if (meta.status === 200) {
          localStorage.setItem('token', data.token)
          this.$message({
            message: meta.msg,
            duration: 1000,
            type: 'success'
          })
          this.$router.push('/index')
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
  .login {
    width: 100%;
    height: 100%;
    background-color: #2d434c;
    overflow: hidden;
    .el-form {
      width: 400px;
      background-color: #fff;
      padding: 20px;
      padding-top: 75px;
      border-radius: 20px;
      margin: 0 auto;
      margin-top: 200px;
      position: relative;
      .loginBtn {
        margin-right: 80px;
      }
      img {
        height: 120px;
        width: 120px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: -70px;
        border-radius: 50%;
        border: 5px solid #fff;
      }
    }
  }
</style>
