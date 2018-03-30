var blogService = require('../core/service/blog.service');
var logger = require('../lib/logger.lib');

/* GET blog page. */
// router.get('/',  function (req, res, next) {
//
//         let pageSize = 5;
//         let query = {};
//         let currentPage = req.params.page || 1;
//         query.currentPage = currentPage;
//         query.deleted = false;
//         query.pageSize = pageSize;
//         console.log("current page  :",currentPage)
//         blogService.list(query, function (err, result) {
//             if (err) {
//                 logger[err.type]().error(err);
//                 console.log(err);
//                 return res.status(500).end();
//             }
//
//             // res.status(200).json(result );
//
//             let pages = result.pages;
//             let preUrl = '';
//             let nextUrl = '';
//             //处理 <<  >> 箭头操作的逻辑
//             // 当前页面<5  回到第一页
//
//             if (currentPage <= 5) {
//                 preUrl = "?pages=" + 1;
//             }
//             else {
//                 preUrl = "?pages=" + currentPage - 5;
//             }
//             if (currentPage + 5 >= pages) {
//                 nextUrl = "?pages=" + pages;
//             }
//             else {
//                 nextUrl = "?pages=" + currentPage + 5;
//             }
//             console.log(result)
//             var blogs = result.contents;
//             console.log(JSON.stringify(blogs));
//             res.render('blog', {
//                 title: '新闻资讯',
//                 blogs: blogs,
//                 ss: ss,
//                 pages: pages,
//                 currentPage: currentPage,
//                 preUrl: preUrl,
//                 nextUrl: nextUrl
//             });
//         });
// });
// module.exports = router;


exports.blogs = function (req, res) {

    let pageSize = 5;
    let query = {};
    let currentPage = req.query.page || 1;
    query.currentPage = currentPage;
    query.deleted = false;
    query.pageSize = pageSize;

    blogService.list(query, function (err, result) {
        if (err) {
            logger[err.type]().error(err);
            console.log(err);
            return res.status(500).end();
        }

        // res.status(200).json(result );

        let pages = result.pages;
        // currentPage =5   [(5-1)/5]=0 *5 +1 = 1
        let startPage = Math.floor((currentPage-1)/pageSize)*5+1;
        let preUrl = '';
        let nextUrl = '';
        //处理 <<  >> 箭头操作的逻辑
        // 当前页面<5  回到第一页
        // 大于5 回到 5的倍数页面
        if (currentPage <= 5) {
            preUrl = "?page=" + 1;
        }
        else {
            preUrl = "?page=" + currentPage - 5;
        }
        if (currentPage + 5 >= pages) {
            nextUrl = "?page=" + pages;
        }
        else {
            nextUrl = "?page=" + currentPage + 5;
        }
        console.log(result);
        let blogs = result.contents;

        console.log(JSON.stringify(blogs));
        // res.render('blog', {title: '新闻资讯', blogs: JSON.stringify(blogs), ss: ss})
        res.render('blog', {
            title: '新闻资讯',
            blogs: blogs,
            pages: pages,
            currentPage: currentPage,
            startPage:startPage,
            preUrl: preUrl,
            nextUrl: nextUrl
        });
    });
};


