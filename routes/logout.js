var express = require('express');
var router = express.Router();
var checkLogin = require('./../middlewares/loginState').checkLogin;

router.get('/',checkLogin, function(req, res) {
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
  /*res.render('index', { title: 'Express' });*/
});

module.exports = router;
