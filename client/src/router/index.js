import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/views/GoodsList'
import Cart from '@/views/Cart'
import Address from '@/views/Address'
import OrderConfirm from '@/views/OrderConfirm'

// import Login from '@/views/Login'

// @就是src
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    },
    {
      path: '/order',
      name: 'OrderConfirm',
      component: OrderConfirm
    },
    // {
    //   path: '/login',
    //   name: 'Login',
    //   component: Login
    // }
  ]
})
