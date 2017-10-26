<template>
  <div>
      <nav-header/>
      <nav-bread>商品列表</nav-bread>
       

    <div class="accessory-result-page accessory-page">
        <div class="container">
            <div class="filter-nav">
                <span class="sortby">Sort by:</span>
                <a href="javascript:void(0)" class="default cur">Default</a>
                <a href="javascript:void(0)" class="price" @click='goodsSort'>Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
                <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
            </div>
            <div class="accessory-result">
                <!-- filter -->
                <div class="filter stopPop" id="filter">
                    <dl class="filter-price">
                        <dt>Price:</dt>
                        <dd><a href="javascript:void(0)" :class="{'cur': priceChecked== 'all'}" @click="setPrice('all')" >All</a></dd>

                        <dd v-for="(item,index) in priceFilter" :key="index">
                            <a @click="setPrice(index)" :class="{'cur': priceChecked== index}" href="javascript:void(0)">{{item.ltPrice}} - {{item.gtPrice}}</a>
                        </dd>

                    </dl>
                </div>

                <!-- search result accessories list -->
                <div class="accessory-list-wrap">
                    <div class="accessory-list col-4">
                        <ul>
                            <li v-for="(item,index) in goods" :key="index">
                            <!-- <li> -->
                                <div class="pic">
                                    <!-- <a href="#"><img src="/static/img/1.jpg" alt=""></a> -->
                                    <a :href="item.productUrl"><img v-lazy="'/static/img/'+item.productImage" alt=""></a>
                                </div>
                                <div class="main">
                                    <!-- <div class="name">XX</div> -->
                                    <div class="name">{{item.productName}}</div>
                                    <!-- <div class="price">999</div> -->
                                    <div class="price">{{item.salePrice}}</div>
                                    <div class="btn-area">
                                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                                    </div>
                                </div>
                            </li>

                            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                            ...
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- <footer class="footer">
  <div class="footer__wrap">
    <div class="footer__secondary">
      <div class="footer__inner">
        <div class="footer__region">
          <span>Region</span>
          <select class="footer__region__select">
            <option value="en-US">USA</option>
            <option value="zh-CN">China</option>
            <option value="in">India</option>
          </select>
        </div>
        <div class="footer__secondary__nav">
          <span>Copyright © 2017 Shudong All Rights Reserved.</span>
          <a href="http://us.lemall.com/us/aboutUs.html">
            About Us
          </a>
          <a href="http://us.lemall.com/us/termsofUse.html">
            Terms &amp; Conditions
          </a>
          <a href="http://us.lemall.com/us/privacyPolicy.html">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  </div>
</footer> -->
<Navfooter/>
<!-- 在未登录的情况下 -->
<modal :mdShow="mdShow">
    <p slot="message">请先登录，否则无法加入购物车</p>
    <div slot="btnGroup">
        <a href="javascript:;" class="btn  btn--m" @click="mdShow=false">关闭</a>
    </div>
</modal>

<modal :mdShow="mdShowCart">
    <div slot='message'>加入购物车成功</div>
    <div slot="btnGroup">
        <a href="javascript:;" class="btn btn--m" @click="mdShowCart=false">继续购物</a>
        <router-link class="btn btn--m" to="/cart">查看购物车列表</router-link>
    </div>
</modal>

  </div>
</template>

<script>
import NavHeader from '@/components/Header'
import NavBread from '@/components/NavBread'
import Navfooter from '@/components/Footer'
import Modal from '@/components/Modal'
import axios from 'axios'

// import '../../static/css/base.css'
// import '../../static/css/product.css'

export default {
  components: {
    NavHeader,
    NavBread,
    Navfooter,
    Modal
  },
  data () {
    return {
        goods: {},
        sortFlag: true,
        priceChecked:'all',
        priceFilter: [
            {ltPrice:0,gtPrice:100},
            {ltPrice:100,gtPrice:500},
            {ltPrice:500,gtPrice:1000},
            {ltPrice:1000,gtPrice:2000},
            // {ltPrice:2000},
        ],
        page:'1',
        pageSize: '4',
        busy: true,
        mdShow: false,
        mdShowCart: false,
    }
  },
  created() {
      this.getGoods();
  },
  methods: {
      getGoods(flag){
        // axios.get('http://easy-mock.com/mock/59664d4d58618039284c7710/example/goods/list')
        // axios.get('/goods')
        // axios.get('http://localhost:3000/goods/list') //跨域了
        let sort = this.sortFlag? 1: -1;
        let param = {
            sort,
            priceRange: this.priceChecked,
            page:this.page,
            pageSize:this.pageSize,
        }

        axios.get('/goods/list',{params:param}).then( res => {
          if(flag){
                // 多次加载
							if(res.data.result.length == 0){
									this.busy = true;
							}else{
									this.busy = false;
							}
						this.goods = this.goods.concat(res.data.result);  
          }else{
            // 第一次加载
            this.goods = res.data.result;
            this.busy = false;
					}
        })
      },
      goodsSort(){
          this.sortFlag = !this.sortFlag;
          this.getGoods();
          
      },
      setPrice(index){
          this.priceChecked = index;
          this.page = 1;
          this.getGoods();
      },
      loadMore: function(){
				
        setTimeout(() => {
          this.page++;
          this.getGoods(true);
        }, 1000);
      },
      addCart(productId){
          axios.post('/goods/addCart',{productId}).then( res => {
              console.log(res.data);
            //   if(res.data.status ==0){
            //       alert(res.data.result);   
            //   }
             if(res.data.status == 1){
                        this.mdShow = true;
                    }else{
                        this.mdShowCart = true;
                    }
          })
      }
  }
}
</script>
