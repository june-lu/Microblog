var express = require('express');
var router = express.Router();
var checkLogin = require('./../middlewares/loginState').checkLogin;
var Post = require('../models/Post')

/* GET home page. */
router.post('/',checkLogin, function(req, res) {
    var currentUser = req.session.user;
    var post = new Post(currentUser.name, req.body.post);
    post.save(function (err) {
        if(err){
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', '发表成功');
        return res.redirect('users/u/' + currentUser.name);
    })
});

module.exports = router;
