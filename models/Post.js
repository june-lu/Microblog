/**
 * Created by 陆晓钧 on 2017/2/21.
 */

var mongondb = require('./db');

function Post(username, post, time) {
    this.name = username;
    this.post = post;
    if(time){
        this.time = time;
    }
    else{
        this.time = new Date();
    }
}

module.exports = Post;

Post.prototype.save = function (callback) {
    //存入Mongodb的文档
    var post = {
        name:this.name,
        post:this.post,
        time:this.time
    };
    mongondb.open(function (err, db) {
        if(err) {
            return callback(err);
        }
        //读取posts集合
        db.collection('posts',function (err, collection) {
            if(err) {
                mongondb.close()
                return callback(err);
            }
            //为name属性添加索引
            collection.ensureIndex('user');
            //写入post文档
            collection.insert(post,{safe:true},function (err,post) {
                mongondb.close()
                return callback(err,post);
            });
        });

    });
}

Post.get = function (username, callback) {
    mongondb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts',function (err,collection) {
            if(err) {
                mongondb.close();
                return callback(err);
            }
            //查找user属性为username文档，如果username是空则匹配全部
            var query = {};
            if(username){
                query.name = username;
            }
            collection.find(query).sort({time:-1}).toArray(function (err,docs) {
                mongondb.close();
                if (err) {
                    return callback(err,null);
                }
                //封装posts为Post对象
                var posts = [];
               docs.forEach(function (doc, index) {
                   var post = new Post(doc.name, doc.post, doc.time);
                   posts.push(post);
               })
                callback(null,posts);
            });
        });
    });
};
