var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings')
var flash = require('connect-flash')

var index = require('./routes/index');
var users = require('./routes/users');
var post = require('./routes/post');
var reg = require('./routes/reg');
var doReg = require('./routes/doReg');
var login = require('./routes/login');
var doLogin = require('./routes/doLogin');
var logout = require('./routes/logout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
/*app.use(session({
    secret: settings.cookieSecret,
    key:settings.db,// 将 session 存储到 mongodb
    Store: new MongoStore({// 将 session 存储到 mongodb
        url: settings.mongodb// mongodb 地址
    })
}));*/
app.use(session({
    name: settings.session.key,// 设置 cookie 中保存 session id 的字段名称
    secret: settings.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    cookie: {
        maxAge: settings.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
    },
    Store: new MongoStore({// 将 session 存储到 mongodb
        url: settings.mongodb// mongodb 地址
    })
}));

app.use(function(req, res, next){
    //console.log("app.usr local");
    res.locals.user = req.session.user;
    res.locals.post = req.session.post;
    var error = req.flash('error');
    res.locals.error = error.length ? error : null;

    var success = req.flash('success');
    res.locals.success = success.length ? success : null;
    next();
});


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/post', post);
app.use('/login', login);
app.use('/login', doLogin);
app.use('/reg', reg);
app.use('/reg', doReg);
app.use('/logout', logout);

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
    uploadDir: path.join(__dirname, 'public/img'),// 上传文件目录
    keepExtensions: true// 保留后缀
}));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/*app.dynamicHelpers({
    user:function (req, res) {
        return req.session.user;
    },
    error:function (req,res) {
        var err = req.flash('error');
        if(err.length)
            return err;
        else
            return null;
    },
    success:function (req, res) {
        var succ = req.flash('success');
        if(succ.length)
            return succ;
        else
            return null;
    }
});*/

module.exports = app;
