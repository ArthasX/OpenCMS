var blogService = require('../core/service/blog.service');
var logger = require('../lib/logger.lib');

exports.content = function (req, res) {
    let id = req.params.id;
    console.log(id);
    res.render('single', {})
}