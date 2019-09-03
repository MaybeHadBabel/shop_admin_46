import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
import moment from 'moment'
import quill from 'vue-quill-editor'
import 'element-ui/lib/theme-chalk/index.css'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
// 全局的 axios 默认值：配置默认的ajax请求的基准地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log(config)
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  response = response.data
  // 只要响应的 meta.status === 401 说明token失效了(伪造, 过期的),
  // 清除无效的token, 拦截到登录去
  if (response.meta.status === 401) {
    localStorage.removeItem('token')
    response.meta.msg = '登录状态已失效, 请重新登录'
    // this.$router.push(....)  this.$router拿到的是整个的路由对象
    router.push('/login')
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
// 全局的时间过滤器
Vue.filter('dateFilter', value => {
  // 此处用的是以秒为单位的时间戳，只有10位数，应该x1000转换位以毫秒位单位的13位数的时间戳
  return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
})
Vue.use(ElementUI)
Vue.use(quill)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
