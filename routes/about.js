var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/',function (req,res,next) {
    res.render('about',{title: '关于我们'})
    console.log("/about")
})
module.exports = router;
