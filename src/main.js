import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入全局样式表
import '@/assets/css/global.css'

// 导入iconfont字体图标
import '../public/fonts/iconfont.css'

// 按需引入 element.js
import '@/plugins/element.js'

// 导入 vue-table-with-tree-grid 插件
import TreeTable from 'vue-table-with-tree-grid'
// 注册为全局组件
Vue.component('tree-table', TreeTable)

// 导入后台接口函数
import * as API from '@/api'
Vue.prototype.$API = API

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor /* { default global options } */)

// 全局过滤器
Vue.filter('dateFormat', originVal => {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
