var blogService = require('../core/service/blog.service');
var logger = require('../lib/logger.lib');
var mongoose = require('mongoose');
var blogModel = require('../core/models/blog.mode');


exports.content = function (req, res) {
    let id = mongoose.Types.ObjectId(req.params.id.toString());
    // let id = mongoose.Types.ObjectId('5ab0ba9fba570e1b4a0e34a5');
    console.log(id);
    let query = {};
    query._id = id;
    blogService.one(query, function (err, result) {
        if (err) {
            logger[err.type]().error(err);
            console.log(err);
            return res.status(500).end();
        }
        console.log("result is :", result);

        res.render('single', {
            title:result.title,
            date:result.date.toLocaleString(),
            abstract:result.abstract,
            author:result.user.nickname,
            content:result.content
        });
    });
};
//
// var database = require('../lib/databas.lib');
// database.connect(()=>{console.log('数据库连接成功')});
// var userModel = require('../core/models/users.model');
// let id = mongoose.Types.ObjectId('5ab0ba9fba570e1b4a0e34a5');
// console.log(id);
// let query = {};
// query._id = id;
// console.log(query)
// blogModel.findOne(query)
//     .exec(function (err, result) {
//     if (err) {
//         logger[err.type]().error(err);
//         console.log(err);
//         return res.status(500).end();
//     }
//     console.log("result is :", result);
//     // res.render('single', {});
// });
//
// userModel.findOne().exec(function(err,result){
//     console.log("user",result)
// })