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
