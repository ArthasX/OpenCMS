var fs = require('fs');
var path = require('path');


function getPath(callback) {
    let mediaPath = '';
    fs.readFile(path.join(__dirname, '../config/path.config.js'), function (err, file) {
        if (err && err.code === 'ENOENT') {
            let err = {
                type: 'system',
                error: 'path.config.js 文件不存在'
            };
            return callback(err);
        } else if (err) {
            err.type = 'system';
            return callback(err);
        } else {
            let config = JSON.parse(file);
            mediaPath = config.rootDir + config.mediaPath;
            callback(mediaPath)
        }
    });
}

module.exports = getPath;