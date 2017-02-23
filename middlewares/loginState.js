/**
 * Created by 陆晓钧 on 2017/2/21.
 */

module.exports = {

    checkLogin: function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '未登入');
            return res.redirect('/login');
        }
        next();//路由中间件，对于一个路径绑定多个响应函数
    },
    checkNotLogin: function checkNotLogin(req, res, next) {
        if (req.session.user)
        {
            req.flash('error', '已登入');
            return res.redirect('/');
        }
        next();
    }
}