const fs = require('fs');
const path = require('path');
const async = require('async');
const mongoose = require('mongoose');
var blogModel = require('../core/model/blog.mode');


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