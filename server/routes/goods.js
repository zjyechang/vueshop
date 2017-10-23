var express = require('express'),
router = express.Router(),
mongoose = require('mongoose');

var Goods = require('../models/goods');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/shop');

mongoose.connection.on('connected', function() {
    console.log("Mongodb connected success");
})

// 当连接发生错误的时候
mongoose.connection.on('error', function() {
    console.log('Mongodb connected fail');
})

// 当关闭连接数据库的时候
mongoose.connection.on('disconnected', function() {
    console.log('Mongodb connected disconnected');
})

router.get('/', function(req, res, next) {
    res.json( {data: '您现在访问的是goods api'});
});

router.get('/list',function(req, res, next){
    // let sort = req.params('sort');
    // // let {sort} = req.query.body;
    // let goodsPriceSort = Goods.find({},sort({'salePrice':sort}));
    // console.log(sort,goodsPriceSort)
    // goodsPriceSort.exec({},function(err,doc){
    //     if(err){
    //         res.json({'status': '1', msg: err.message});
    //     }else{
    //         res.json({'status': '0', msg: "数据获取成功",result: doc});
    //     }
    // })
    Goods.find({},function(err,doc){
        if(err){
            res.json({'status': '1', msg: err.message})
        }else{
            res.json({'status': '0', msg: "数据获取成功",result: doc})
        }
    })
})
module.exports = router;