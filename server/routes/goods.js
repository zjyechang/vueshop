var express = require('express'),
router = express.Router(),
mongoose = require('mongoose');

var Goods = require('../models/goods');
var User = require('../models/user');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/shop');

mongoose.connection.on('connected', function() {
    console.log("Mongodb connected success");
})

// 当连接发生错误的时候
mongoose.connection.on('error', function() {
    console.log('Mongodb connected fail');
});

// 当关闭连接数据库的时候
mongoose.connection.on('disconnected', function() {
    console.log('Mongodb connected disconnected');
});

router.get('/', function(req, res, next) {
    res.json( {data: '您现在访问的是goods api'});
});

router.get('/list',function(req, res, next){
    // let 
    let sort = req.param('sort');
    let priceRange = req.param('priceRange');
    let currentPage = parseInt(req.param('page')) > 0 ? parseInt(req.param('page')) : 1;
    let pageSize = parseInt(req.param('pageSize')) > 0 ? parseInt(req.param('pageSize')) : 8;
    // 跳过多少条数据
    let skip = (currentPage-1) * pageSize;
    console.log(skip)
    
    let gtprice,ltprice,param = {};

    if(priceRange != 'all'){
        // switch(priceRange){
        //     case '0':
        //         gtprice = 0;
        //         ltprice = 100;
        //         break;
        //     case '1':
        //         gtprice = 100;
        //         ltprice = 500;
        //         break;
        //     case '2':
        //         gtprice = 500;
        //         ltprice = 1000;
        //         break;
        //     case '3':
        //         gtprice = 1000;
        //         ltprice = 2000;
        //         break;
        // }
        
        // 表驱动法
        let priceItem = [[0,100],[100,500],[500,1000],[1000,2000]];
        param = {
            salePrice: {
                $gt: priceItem[priceRange][0],
                $lte: priceItem[priceRange][1],
            }
        }
    }
    // let {sort} = req.query.body;
    let goodsPriceSort = Goods.find(param);

    goodsPriceSort.sort({'salePrice': sort}).skip(skip).limit(pageSize);
    goodsPriceSort.exec({},function(err,doc){
			if(err){
					res.json({'status': '1', msg: err.message});
			}else{
					res.json({'status': '0', msg: "数据获取成功",result: doc});
			}
    })
    // Goods.find({},function(err,doc){     
    //     if(err){
    //         res.json({'status': '1', msg: err.message})
    //     }else{
    //         res.json({'status': '0', msg: "数据获取成功",result: doc})
    //     }
    // })
});
router.post('/addCart',function(req,res,next){
    var productId = req.body.productId;
    console.log(productId);
    // 用户ID
    var userId = 100000077;
 // 根据用户id查询用户数据，确定好用户
    User.findOne({ userId: userId },function( err, userDoc ) {
        let goodsItem = '';
        userDoc.cartList.forEach(function(item){
            if(item.productId == productId){
                goodsItem = item;
                item.productNum++;
            }
        })
        if(goodsItem){
            userDoc.save(function(err2,doc2){
                if(err2){
                    res.json({ status: "1", msg: err2.message })
                }else{
                    res.json({
                            status: 0,
                            msg: "",
                            result: '添加商品数量成功'
                    })
                }
            })
        } else {
            Goods.findOne({'productId':productId},function(err,goodsDoc){
                goodsDoc.productNum = 1;
                
                userDoc.cartList.push(goodsDoc);
                userDoc.save(function(err2,doc2){
                    if(err2){
                    res.json({ status: "1", msg: err2.message })
                }else{
                    
                    res.json({
                            status: 0,
                            msg: "",
                            result: '添加购物车成功'
                    })
                }
                })
            })

        }
    })
});
module.exports = router;