var fs = require('fs');
var path = require('path');
var async = require('async');
var mongoose = require('mongoose');
var blogModel = require('../core/models/blog.mode');


mongoose.Promise = require('bluebird');

exports.test = function (options, callback) {
    let db = mongoose.createConnection();
    db.open(options.host, options.db, options.port, {
        user: options.user,
        pass: options.pass
    }, function (err) {
        if (err) {
            err.type = 'system';
            return callback(err);
        }
        db.close(function () {
            callback();
        });
    });
};

exports.connect = function (callback) {
    async.waterfall([
        function (callback) {
            fs.readFile(path.join(__dirname, '../config/database.config.js'), function (err, file) {
                if (err && err.code === 'ENOENT') {
                    let err = {
                        type: 'system',
                        error: 'database.config.js 文件不存在'
                    };
                    return callback(err);
                } else if (err) {
                    err.type = 'system';
                    return callback(err);
                }
                var config = JSON.parse(file);
                var databaseConfig = {
                    host: config.host,
                    port: config.port,
                    db: config.db,
                    user: config.user,
                    pass: config.pass
                };

                callback(null, databaseConfig);
            });
        },
        function (config, callback) {
            mongoose.connect('mongodb://' + config.host + ':' + config.port + '/' + config.db, {
                user: config.user,
                pass: config.pass
            }, function (err) {
                if (err) {
                    err.type = 'database';
                    return callback(err);
                }

                callback();
            });
        }
    ], function (err) {
        if (err)
            return callback(err);
        callback();
    });
};