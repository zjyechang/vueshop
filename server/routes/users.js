var express = require('express');
var router = express.Router();
var User = require('../models/user');
require('../util/util')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a shit');
});

router.post('/login', function(req, res, next){
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd,
  };
  User.findOne(param, function(err, doc){
    if(err){
      res.json({status: '1',msg: '用户名密码错误'})
    }else{
      if(!doc){
        res.json({status: '1',msg: '用户名不存在'})
            //把userId 和 userName 存到cookie里面，在控制台的application里面找到cookie可以查看

            // 第一个参数存的是 cookie 名字，第二个参数存的是值，地三个对象，里面
            // path 是存的路径，maxAge 过期时间，以毫秒为单位
      }else{
        res.cookie('userId', doc.userId,{
          path: '/',
          maxAge: 36000000
        })
  
        res.cookie('userName',doc.userName, {
          path: '/',
          maxAge: 36000000
        })

        res.json({
          status: 0,
          msg: '',
          result: {
              userName: doc.userName
          }
      })
      }
    }
  })
})
// 检查是否登录
router.post('/checkLogin', function(req, res, next){
  if(req.cookies.userId) {
    res.json({
      status: 0,
      result: req.cookies.userName
    })
  }else {
    res.json({
      status: 1,
      msg: '未登录',
      result: ''
    })
  }
})

// 退出登录
router.post('/logout', function(req, res, next){
  res.cookie('userId', "", {
    path: '/',
    maxAge: -1,
  })

  res.json({
    status: 0,
    msg: '',
    result: '退出登录成功'
  })
})

// 购物车列表
router.post('/cartList', function(req, res, next){
  let userId = req.cookies.userId;
  // User.findOne({userId: userId},function(err, doc){
  //   if (err) { 
  //     res.json({ status: '1', msg: err.message, result: '' }) 
  //   } else {
  //     res.json({
  //         status: 0,
  //         msg: '',
  //         result: doc.cartList
  //     })
  // }
  // })
  User.findOne({ userId: userId }, function(err, doc) {
    if (err) { res.json({ status: '1', msg: err.message, result: '' }) } else {
        res.json({
            status: 0,
            msg: '',
            result: doc.cartList
        })
    }
})
})

router.post('/cartUpdate', function(req, res, next){
  let userId = req.cookies.userId,
      productId = req.body.productId,
      checked = req.body.checked,  
      productNum = req.body.productNum;

  User.update({userId,'cartList.productId': productId},{
   'cartList.$.productNum': productNum,
   "cartList.$.checked": checked
  },function(err, doc){
    if(err){
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      })
    }else{
      res.json({
        status: 0,
        msg: '',
        result: '修改购物车成功'
      })
    }
  })
})

router.post('/checkAll',function(req, res, next) {
  let userId = req.cookies.userId,
  checkAll = req.body.checkAll;

  User.findOne({userId},function(err, doc){
    if(err){
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      })
    }else{
      doc.cartList.forEach( item =>{
        item.checked = checkAll;
      })

      doc.save(function(err, doc){
        if (err) { res.json({ status: '1', msg: err.message, result: '' }) } else {
          res.json({ status: '0', msg: '', result: '操作成功' });
        }
      })
    }
  })
})

router.post('/cartDel',function(req, res, next){
  var userId = req.cookies.userId,
      productId = req.body.productId;

  User.update({userId: userId},{
    $pull: {
      'cartList': {productId: productId}
    }
  }, function(err, doc){
    if(err){
      res.json({ status: 1, msg: err.message, result: '' })
    }else{
      res.json({ status: 0, msg: '', result: '商品删除成功' })
    }
  })
})

router.get('/addressList',function(req, res, next){
  let userId = req.cookies.userId;
  User.findOne({userId},function(err, doc){
    if (err) {
      res.json({ status: 1, msg: err.message, result: '' })
    } else {
        res.json({ status: 0, msg: '', result: doc.addressList })
    }
  })
})

router.post('/setDefault', function(req, res, next){
  let userId = req.cookies.userId,
      addressId = req.body.addressId;

  if(!addressId){
    res.json({ staus: 1, msg: '不存在的地址'});
  }else{
    User.findOne({userId}, function(err, doc){
      if(err){
        return res.json({ staus: 1, msg: err.message, result: ''})      
      }
      let address =doc.addressList;
      address.forEach( item=>{
        if(addressId == item.addressId){
          item.isDefault = true;
        }else{
          item.isDefault = false;
        }
      })

      doc.save(function(err1, doc1){
        if (err1) {
          res.json({
              status: '1',
              msg: err.message,
              result: ''
          })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: doc1
            })
        }
      })
    })

  }
})
// router.post('/addAddress',function(req, res, next){
//   let userId = req.cookies.userId,
      
// })
router.post('/delAddress',function(req, res, next){
  let userId = req.cookies.userId,
      addressId = req.body.addressId;
      User.findOne({userId},function(err, doc){
        let addList =  doc.addressList;
        addList.forEach( (item,idx)=>{
          if(item.addressId == addressId){
            addList.splice(idx,1);
          }
        })
        doc.save(function(err1, doc1){
          if(err1){ res.json({status: '1', msg: "存储数据错误", result: ''})}else{
            res.json({status: '0',msg: '删除成功', result: ''})
          }
        })
      })
})
router.post('/payMent', function(req, res, next){
  let userId = req.cookies.userId,
      addressId = req.body.addressId,
      orderTotal = req.body.orderTotal;

  User.findOne({userId}, function(err, doc){
    if(err){
      res.json({ staus: 1, msg: err.message, result: ''})      
    }else{
      let address ='', goodsList = [];

      // 获取地址
      doc.addressList.forEach( item => {
        if(item.addressId ==address){
          address = item;
        }
      })
      // 获取购买的商品
      doc.cartList.filter( item =>{
        if(item.checked == '1'){
          goodsList.push(item)
        }
      })
  
      // 生成订单号
      var platform = '622';
      var r1 = Math.random()*10 | 0;
      var r2 = Math.random()*10 | 0;
      var sysDate = new Date().Format('yyMMddhhmmss');
      var createDate = new Date().Format('yy-MM-dd hh:mm:ss');
      var orderId = platform+r1+sysDate+r2;


      var order = {
        orderId,
        orderTotal,
        address,
        goodsList,
        orderStatus: '10',
        createDate
      }
  
      doc.orderList.push(order);
      doc.save(function(err1, doc1){
        if(err1){
          res.json({ status:1 ,msg: err.message, result: ''})
        }else{
          res.json({status: 0 , msg: '', result: { orderId: order.orderId, orderTotal: orderTotal }})
        }
      })
    }
  })
})

router.get('/orderDetail', function(req, res, next){
  let orderId = req.query.orderId,
      userId = req.cookies.userId;
  User.findOne({userId}, function(err, doc){
    if(err){
      res.json({ staus: 1, msg: err.message, result: ''})      
    }else{
      let orderTotal = 0, 
      orderList = doc.orderList;

      if(orderList.length > 0){
        orderList.forEach( item =>{
          if(item.orderId == orderId){
            orderTotal = item.orderTotal;
            res.json({ status: 0, msg: '', result: { orderId: orderId, orderTotal: orderTotal } });
          }
        })
      }else{
      res.json({ staus: 10010, msg: "当前用户未创建订单", result: ''})            
      }
    }
  })
})
module.exports = router;