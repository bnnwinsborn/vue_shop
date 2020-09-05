import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import VueDirectiveImagePreviewer from 'vue-directive-image-previewer'
import 'vue-directive-image-previewer/dist/assets/style.css'
// 导入vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'

// 导入
import '../src/assets/fonts/iconfont.css'
import '../src/assets/icons/iconfont.css'
// 导入全局样式
import '../src/assets/css/global.css'
// 导入moment
import moment from 'moment'
// 导入axios
import axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor /* { default global options } */)
Vue.use(VueDirectiveImagePreviewer)
// 配置请求的根路径
axios.defaults.baseURL = 'http://129.211.95.165:8888/api/private/v1/'
// axios请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config// 请求头配置项
})
Vue.prototype.$http = axios
// 创建过滤器将秒数过滤为年月日，时分秒
// Vue.filter('dateFormat', function (originVal) {
//   const dt = new Date(originVal)
//   const y = dt.getFullYear()
//   const m = (dt.getMonth() + 1 + '').padStart(2, '0')
//   const d = (dt.getDate() + '').padStart(2, '0')

//   const hh = (dt.getHours() + '').padStart(2, '0')
//   const mm = (dt.getMinutes() + '').padStart(2, '0')
//   const ss = (dt.getSeconds() + '').padStart(2, '0')

//   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
// })
// 利用moment插件
Vue.filter('dateFormat', (date) => {
  return moment.unix(date).format('YYYY-MM-DD HH:mm:ss')
})
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
