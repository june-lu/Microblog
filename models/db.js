/**
 * Created by 陆晓钧 on 2017/2/17.
 */

var settings = require("../settings");
var Db = require('mongodb').Db;//数据库类型
var Server = require('mongodb').Server;

module.exports = new Db(settings.db, new Server(settings.host,27017,{}));