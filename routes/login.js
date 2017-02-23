var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user');
var checkNotLogin = require('./../middlewares/loginState').checkNotLogin;

/* GET login page. */
router.get('/',checkNotLogin,function (req,res) {
    res.render('login',{title:'用户登录'})
});

router.post('/',checkNotLogin, function(req, res) {
    //res.send(req.body['password-repeat']);


    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    /*if(req.body['password-repeat'] != req.body['password'])
    {
        req.flash('error','两次输入的密码不一致');//flash保存的变量只会在用户当前和下一次请求中别访问，之后被删除
        return res.redirect('/reg');
    }

    var newUser = new User({
        name: req.body.username,
        password:password
    });*/

    //检测用户名是否存在
    User.get(req.body.username,function (err, user) {
        if(!user) {
            req.flash('error', '用户不存在');
            return res.redirect('/login');
        }
        if(user.password != password)
        {
            req.flash('error', '密码不正确');
            return res.redirect('/login');
        }

        //密码和用户名正确
        req.session.user = user;
        req.flash('success', '登入成功');
        res.redirect('/');
    });
});

module.exports = router;
