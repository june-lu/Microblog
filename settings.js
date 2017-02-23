/**
 * Created by 陆晓钧 on 2017/2/16.
 */

module.exports = {
    port: 3000,
    host:'localhost',
    db:'myblog',
    session: {
        secret: 'myblog',
        key: 'myblog',
        maxAge: 2592000000
    },
    mongodb: 'mongodb://localhost:27017/myblog'
};

/*
module.exports = {
    cookieSecret:'microblogturne',
    db:'microblog',//数据库的名字
    host:'localhost',
    mongodb: 'mongodb://localhost:27017/microblog'
}*/
