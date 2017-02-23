var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user');
var checkNotLogin = require('./../middlewares/loginState').checkNotLogin;

router.get('/',checkNotLogin, function(req, res) {
    res.render('reg', { title: '用户注册' });
});

router.post('/',checkNotLogin, function(req, res, next) {
    //res.send(req.body['password-repeat']);
    if(req.body['password-repeat'] != req.body['password'])
    {
        req.flash('error','两次输入的密码不一致');//flash保存的变量只会在用户当前和下一次请求中别访问，之后被删除
        return res.redirect('/reg');
    }

    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    var newUser = new User({
        name: req.body.username,
        password:password
    });

    //检测用户名是否存在
    User.get(newUser.name,function (err, user) {
        if(user)
            err = '用户名已存在';
        if(err) {
            req.flash('error', err);
            return res.redirect('/reg');
        }

        //如果不存在就新增该用户
        newUser.save(function (err) {
            if(err) {
                req.flash('error', err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.flash('success', '注册成功');
            res.redirect('/');
        });
    });
});

module.exports = router;
