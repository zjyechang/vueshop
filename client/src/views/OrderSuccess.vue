<template>
	<div>
		  <nav-header/>
    <nav-bread><span>支付成功</span></nav-bread>
  <div class="container">
    <div class="page-title-normal">
      <h2 class="page-title-h2"><span>check out</span></h2>
    </div>
    <!-- 进度条 -->
    <div class="check-step">
      <ul>
        <li class="cur"><span>Confirm</span> address</li>
        <li class="cur"><span>View your</span> order</li>
        <li class="cur"><span>Make</span> payment</li>
        <li class="cur"><span>Order</span> confirmation</li>
      </ul>
    </div>

    <div class="order-create">
      <div class="order-create-pic"><img src="/static/img/ok-2.png" alt=""></div>
      <div class="order-create-main">
        <h3>Congratulations! <br>Your order is under processing!</h3>
        <p>
          <span>Order ID：{{orderId}}</span>
          <span>Order total：{{orderTotal}}</span>
        </p>
        <div class="order-create-btn-wrap">
          <div class="btn-l-wrap">
            <a href="/cart" class="btn btn--m">Cart List</a>
          </div>
          <div class="btn-r-wrap">
            <a href="/" class="btn btn--m">Goods List</a>
          </div>
        </div>
      </div>
    </div>
  </div>
	</div>
</template>

<script>
import NavHeader from '@/components/Header'
import NavFooter from '@/components/Footer'
import NavBread from '@/components/NavBread'

export default {
	data(){
      return {
		orderId: '',
		orderTotal: '',
      }
	},
	components:{
		NavHeader,
		NavFooter,
		NavBread
	},
	created(){
		this.init();
	},
	methods: {
		init(){
			let orderId = this.$route.query.orderId;
			if(!orderId) return
			this.$http.get('/users/orderDetail?orderId='+orderId).then( result=> {
				let res = result.data
				if(res.status ==0){
					this.orderId = res.result.orderId;
					this.orderTotal = res.result.orderTotal;
				}
			})
		}	
	}
}
</script>

