var async = require('async');
var _ = require('lodash');
var marked = require('marked');
var categories = require('../models/categories.model');
var blogModel = require('../models/blog.mode');
var mediaModel = require('../models/media.model');
var user = require('../models/users.model')
var moment = require('moment');
/**
 *
 * @param options
 * @param callback
 */
// exports.one = function (options, callback) {
//     var query = {};
//     var reading = true;
//     var markdown = false;
//     console.log("blogModel.options", options);
//     if (options._id) query._id = options._id;
//     if (options.status) query.status = options.status;
//     if (options.alias) query.alias = options.alias;
//     if (_.isBoolean(options.reading)) reading = options.reading;
//     if (_.isBoolean(options.markdown)) markdown = options.markdown;
//     console.log("begin to find one");
//     blogModel.findOne(query)
//         .select('status category title alias user date reading thumbnail media abstract content tags extensions')
//         .populate('category', 'name path')
//         .populate('thumbnail', 'filename description date src')
//         .populate('user', 'nickname email')
//         .populate('media', 'fileName description date src')
//         .exec(function (err, content) {
//             console.log("blogModel.findOne", content);
//             if (err) {
//                 err.type = 'database';
//                 return callback(err);
//             }
//             console.log("blogModel.findOne", content);
//             if (!content) return callback();
//
//             async.waterfall([
//                 //阅读量+1
//                 function (callback) {
//                     if (reading) {
//                         console.log("reading ",true);
//                         exports.reading({_id: content._id}, function (err, reading) {
//                             if (err) return callback(err);
//
//                             if (reading) {
//                                 callback(null, reading);
//                             } else {
//                                 callback(null, null);
//                             }
//                         });
//                     } else {
//                         callback(null, null);
//                     }
//                 },
//                 function (reading, callback) {
//                     if (content.thumbnail) var thumbnailSrc = content.thumbnail.src;
//                     if (!_.isEmpty(content.media)) var meiaSrc = _.map(content.media, 'src');
//                     content = content.toObject();
//                     if (_.get(content, 'category.path')) content.url = content.category.path + '/' + content.alias;
//
//                     if (reading) content.reading = reading;
//                     if (content.content && !markdown) content.content = marked(content.content);
//
//                     if (content.thumbnail) content.thumbnail.src = thumbnailSrc;
//                     if (!_.isEmpty(content.media)) {
//                         _.forEach(content.media, function (medium, index) {
//                             medium.src = meiaSrc[index];
//                         });
//                     }
//
//                     delete content.category;
//
//                     if (!markdown) delete content.alias;
//
//                     if (_.get(content, 'reading.createAt')) delete content.reading.createAt;
//
//                     callback(null, content);
//                 }
//             ], callback);
//         });
//     console.log("end find");
// };
exports.one = function (options, callback) {
    var query = {};
    var reading = true;
    var markdown = false;

    if (options._id) query._id = options._id;
    if (options.status) query.status = options.status;
    if (options.alias) query.alias = options.alias;
    if (_.isBoolean(options.reading)) reading = options.reading;
    if (_.isBoolean(options.markdown)) markdown = options.markdown;

    blogModel.findOne(query)
        .select('status category title alias user date reading thumbnail media abstract content tags extensions')
        .populate('category', 'name path')
        .populate('thumbnail', 'fileName description date src')
        .populate('user', 'nickname email')
        .populate('media', 'fileName description date src')
        .exec(function (err, content) {
            if (err) {
                err.type = 'database';
                return callback(err);
            }

            if (!content) return callback();

            async.waterfall([
                // 阅读量 +1
                function (callback) {
                    if (reading) {
                        exports.reading({_id: content._id}, function (err, reading) {
                            if (err) return callback(err);

                            if (reading) {
                                callback(null, reading);
                            } else {
                                callback(null, null);
                            }
                        });
                    } else {
                        callback(null, null);
                    }
                },
                function (reading, callback) {
                    if (content.thumbnail) var thumbnailSrc = content.thumbnail.src;
                    if (!_.isEmpty(content.media)) var meiaSrc = _.map(content.media, 'src');

                    content = content.toObject();
                    if (_.get(content, 'category.path')) content.url = content.category.path + '/' + content.alias;

                    if (reading) content.reading = reading;
                    if (content.content && !markdown) content.content = marked(content.content);

                    if (content.thumbnail) content.thumbnail.src = thumbnailSrc;
                    if (!_.isEmpty(content.media)) {
                        _.forEach(content.media, function (medium, index) {
                            medium.src = meiaSrc[index];
                        });
                    }

                    delete content.category;

                    if (!markdown) delete content.alias;

                    if (_.get(content, 'reading.createAt')) delete content.reading.createAt;

                    callback(null, content);
                }
            ], callback);
        });
};
/**
 * 多条内容
 * @param {Object} options
 *        {MongoId} options._id
 *        {Boolean} options.deleted
 *        {String|Array} options.type
 *        {Number} options.currentPage
 *        {Number} options.pageSize
 * @param callback
 */
exports.list = function (options, callback) {
    var query = {};
    var currentPage = 1;
    var pageSize = 5;

    if (options._id) query.category = options._id;
    if (options.words) query.title = new RegExp(options.words, 'i');
    if (options.status) query.status = options.status;
    if (_.isBoolean(options.deleted)) query.deleted = options.deleted;
    if (options.currentPage) currentPage = parseInt(options.currentPage);
    if (options.pageSize) pageSize = parseInt(options.pageSize);
    if (options.date) query.date = options.date;

    async.waterfall([
        function (callback) {
            blogModel.count(query, function (err, count) {
                if (err) {
                    err.type = 'database';
                    return callback(err);
                }
                if (count) {
                    callback(null, count);
                } else {
                    callback(null, null);
                }
            });
        },
        function (count, callback) {
            blogModel.find(query)
                .sort('status -date')
                .skip((currentPage - 1) * pageSize)
                .limit(pageSize)
                .select('status category title alias user date reading thumbnail abstract extensions')
                .populate('category', 'name path')
                .populate('user', 'nickname email')
                .populate('thumbnail', 'fileName description date src')
                .exec(function (err, contents) {
                    if (err) {
                        err.type = ' database';
                        return callback(err);
                    }
//TODO 这里的thumbail 需要加一个路径，因为是两个项目 所以到时候要写死一下或者写到配置文件里面去
                    contents = _.map(contents, function (content) {
                        if (content.thumbnail) var thumbnailSrc = content.thumbnail.src;

                        content = content.toObject()
                        if (_.get(content, 'category.path')) content.url = content.category.path + '/' + content.alias;

                        if (content.thumbnail) content.thumbnail.src = thumbnailSrc;

                        delete content.alias;

                        return content;
                    });

                    callback(null, count, contents);
                });
        }
    ], function (err, count, contents) {
        if (err) return callback(err);

        var result = {
            contents: contents,
            pages: Math.ceil(count / pageSize)
        };

        callback(err, result);
    })
};

/**
 * 文章总数
 * @param {Function}callback
 */
exports.total = function (callback) {
    blogModel.count({}, function (err, count) {
        if (err) {
            err.type = 'database';
            return callback(err);
        }

        callback(null, count);
    });
};

exports.reading = function (options, callback) {
    if (!options._id) return callback(null);

    blogModel.findById(options._id)
        .exec(function (err, content) {
            if (err) {
                err.type = 'database';
                return callback(err);
            }

            if (!content) return callback();

            content.reading.total = content.reading.total + 1;

            if (content.reading.createAt.day <= new Date(moment(000000, 'hhmmss').format())) {
                content.reading.day = 1;
                content.reading.createAt.day = new Date();
            } else {
                content.reading.day = content.reading.day + 1;
            }

            if (content.reading.createAt.week <= new Date(moment(000000, 'hhmmss').isoWeekday(1).format())) {
                content.reading.week = 1;
                content.reading.createAt.week = new Date();
            } else {
                content.reading.week = content.reading.week + 1;
            }

            if (content.reading.createAt.month <= new Date(moment(000000, 'hhmmss').set('date', 1).format())) {
                content.reading.month = 1;
                content.reading.createAt.month = new Date();
            } else {
                content.reading.month = content.reading.month + 1;
            }

            content.save(function (err) {
                if (err) logger.database().error(__filename, err);
            });

            callback(null, content.toObject().reading);
        });
};
exports.checkAlias = function (options, callback) {
    if (!options.alias) {
        return callback({
            type: 'system',
            error: 'alias 不能为空'
        });
    }

    blogModel.find({
        alias: {
            $in: [options.alias, new RegExp('^' + options.alias + '-\\d+$')]
        }
    }, 'alias', function (err, contents) {
        if (err) {
            err.type = 'database';
            return callback(err);
        }

        if (contents.length === 0 || (contents.length === 1 && contents[0]._id.toString() === options._id)) {
            callback(null, options.alias);
        } else {
            var aliasSuffix = [];

            for (var i = 0; i < contents.length; i++) {
                var suffix = contents[i].alias.match(/-(\d+)$/);
                if (suffix) aliasSuffix.push(suffix[1]);
            }

            if (aliasSuffix.length > 0) {
                options.alias = options.alias + '-' + (Number(Math.max.apply(null, aliasSuffix)) + 1);
            } else {
                options.alias = options.alias + '-2';
            }

            callback(null, options.alias);
        }
    });
};

exports.save = function (options, callback) {
    if (!options.data) {
        var err = {
            type: 'system',
            error: '没有data传入'
        };
        return callback(err);
    }

    var data = options.data;
    var _id = options._id;
    var ids = options.ids;

    if (ids) {
        blogModel.update({$in: {_id: ids}}, data, {multi: true, runValidators: true}, function (err) {
            if (err) {
                err.type = 'database';
                return callback(err);
            }
            callback();
        });
    } else if (_id) {
        async.auto({
            checkAlias: function (callback) {
                if (!data.alias) return callback();

                exports.checkAlias({
                    _id: _id,
                    alias: data.alias
                }, function (err, alias) {
                    if (err) callback(err);

                    data.alias = alias;

                    callback();
                });
            },
            updateContent: ['checkAlias', function (callback) {
                blogModel.findByIdAndUpdate(_id, data, {renValidators: true}, function (err, oldContent) {
                    callback(err, oldContent);
                });
            }],
            pullMedia: ['updateContent', function (callback, results) {
                if (!data.media) return callback();

                var oldMedia = results.updateContent.media;
                var newMedia = data.media;
                var oldThumbnail = results.updateContent.thumbnail;
                var newThumbnail = data.thumbnail;


                var pullMedia = _.difference(_.map(oldMedia, function (medium) {
                    return medium.toString();
                }), newMedia);

                if (oldThumbnail) {
                    var isQuote = _find(newMedia, function (medium) {
                        return medium === oldThumbnail.toString();
                    });

                    if (!isQuote) pullMedia.push(oldThumbnail.toString());
                }

                if (newThumbnail) {
                    _.pull(pullMedia, newThumbnail);
                }

                mediaModel.update({_id: {$in: pullMedia}}, {$pull: {quote: _id}}, {
                    multi: true,
                    runValidators: true
                }, function (err) {
                    callback(err);
                });
            }],
            addMedia: ['updateContent', function (callback, results) {
                if (!data.media) return callback();

                var oldMedia = results.updateContent.media;
                var newMedia = data.media;
                var oldThumbnail = results.updateContent.thumbnail;
                var newThumbnail = data.thumbnail;

                var addMedia = _.difference(newMedia, _.map(oldMedia, function (medium) {
                    return medium.toString()
                }));

                if (newThumbnail && oldThumbnail && newThumbnail === oldThumbnail.toString()) {
                    _.pull(addMedia, newThumbnail);
                }

                if ((newThumbnail && !oldThumbnail) || (oldThumbnail && (newThumbnail !== oldThumbnail.toString()))) {
                    addMedia.push(newThumbnail);
                }

                mediaModel.update({_id: {$in: addMedia}}, {$addToSet: {quotes: _id}}, {
                    multi: true,
                    runValidators: true
                }, function (err) {
                    callback(err);
                });
            }]
        }, function (err) {
            if (err) {
                err.type = 'database';
                return callback(err);
            }

            callback();
        });
    } else {
        async.auto({
            checkAlias: function (callback) {
                exports.checkAlias({alias: data.alias}, function (err, alias) {
                    if (err) callback(err);

                    data.alias = alias;

                    callback();
                });
            },
            saveContent: ['checkAlias', function (callback) {
                new blogModel(data).save(function (err, content) {
                    callback(err, content);
                });
            }],
            updateMedia: ['saveContent', function (callback, results) {
                if (data.thumbnail) {
                    data.media = data.media || [];
                    data.media.push(data.thumbnail);
                }

                mediaModel.update({_id: {$in: _.uniq(data.media)}}, {$addToSet: {quotes: results.saveContent._id}}, {
                    multi: true,
                    runValidators: true
                }, function (err) {
                    callback(err);
                });
            }]
        }, function (err) {
            if (err) {
                err.type = 'database';
                return callback(err);
            }

            callback();
        });
    }
};


exports.remove = function (options, callback) {
    if (!options._id && !options.ids) {
        var err = {
            type: 'system',
            error: '没有_id 或者ids传入'
        };

        return callback(err);
    }

    var _id = options._id;
    var ids = options.ids;

    if (ids) {
        async.auto({
            contents: function (callback) {
                blogModel.find({_id: {$in: ids}})
                    .select('_id thumbnail media')
                    .lean()
                    .exec(callback);
            },
            removeContents:
                ['contents', function (callback, results) {
                    async.eachLimit(results.contents, 100, function (content, callback) {
                        blogModel.remove({_id: {$in: ids}}, callback);
                    }, callback);
                }],
            updateMedia: ['contents', function (callback, results) {
                async.eachLimit(results.contents, 20, function (content, callback) {
                    if (content.thumbnail) content.media.push(content.thumbnail);
                    mediaModel.update({_id: {$in: content.media}}, {$pull: {quotes: content._id}}, {
                        multi: true,
                        runValidators: true
                    }, callback);
                }, callback);
            }]
        }, function (err) {
            if (err) {
                err.type = 'database';
                return callback(err);
            }
            callback();
        });
    } else {
        blogModel.findById(_id)
            .exec(function (err, content) {
                if (err) {
                    err.type = 'database';
                    return callback(err);
                }
                if (!content) return callback();

                if (content.deleted === false) {
                    content.deleted = true;
                    content.save(function (err) {
                        if (err) {
                            err.type = 'database';
                            return callback(err);
                        }

                        callback();
                    });
                } else {
                    async.waterfall([
                        function (callback) {
                            blogModel.findByIdAndRemove(_id, function (err, oldContent) {
                                callback(err, oldContent.toObject());
                            });
                        },
                        function (oldContent, callback) {
                            if (oldContent.thumbnail) oldContent.media.pull(oldContent.thumbnail);

                            mediaModel.update({_id: {$in: oldContent.media}}, {$pull: {quotes: _id}}, {
                                multi: true,
                                runValidators: true
                            }, function (err) {
                                callback(err);
                            });
                        }
                    ], function (err) {
                        if (err) {
                            err.type = 'database';
                            return callback(err);
                        }
                        callback();
                    })
                }

            })
    }
};