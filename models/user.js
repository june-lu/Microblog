/**
 * Created by 陆晓钧 on 2017/2/18.
 */

var mongondb = require('./db')

function User(user) {
    this.name = user.name;
    this.password = user.password;
}
module.exports = User;

User.prototype.save = function (callback) {
    //存入Mongodb的文档
    var user = {
        name:this.name,
        password:this.password
    };
    mongondb.open(function (err, db) {
        if(err) {
            return callback(err);
        }
        //读取users集合
        db.collection('users',function (err, collection) {
            if(err) {
                mongondb.close()
                return callback(err);
            }
            //为name属性添加索引
            collection.ensureIndex('name', {unique:true});
            collection.insert(user,{safe:true},function (err,user) {
                mongondb.close()
                return callback(err,user);
            });
        });

    });
};

User.get = function (username, callback) {
    mongondb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err) {
                mongondb.close();
                return callback(err);
            }

            collection.findOne({name:username}, function (err,doc) {
                mongondb.close();
                if(doc){
                    //封装文档为User对象
                    var user = new User(doc);
                    callback(err,user);
                }
                else{
                    callback(err,null);
                }
            });
        });
    });
};

