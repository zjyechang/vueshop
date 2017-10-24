// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
// 进度条懒加载
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)
// Vue.use(VueLazyload)

// or with options
Vue.use(VueLazyload, {
  // preLoad: 1.3,
  // error: 'dist/error.png',
  loading: '/static/img/ok-2.png',
  // attempt: 1
})

import '../static/css/index.css'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
