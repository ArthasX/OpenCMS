var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function (req, res, next) {
    var page = req.params.page || 1;
    console.log("page index",page);
    var ss = "sss";
    var blogs = [{
        title: '1',
        content: '11',
        date: '2014-01-01',
        img: 'images/4.jpg'
    }, {
        title: '2',
        content: '22',
        date: '2014-01-01',
        img: 'images/444.jpg'
    }];
    var pages=5;
    console.log(JSON.stringify(blogs));
    // res.render('blog', {title: '新闻资讯', blogs: JSON.stringify(blogs), ss: ss})
    res.render('blog', {title: '新闻资讯', blogs: blogs, ss: ss,pages:5})
});


router.post('/',function (req,res,next){

});


module.exports = router;
