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

// 导入axios
import axios from 'axios'
Vue.use(VueDirectiveImagePreviewer)
// 配置请求的根路径
axios.defaults.baseURL = 'http://129.211.95.165:8888/api/private/v1/'
// axios请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config// 请求头配置项
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
