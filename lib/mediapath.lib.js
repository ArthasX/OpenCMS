var fs = require('fs');
var path = require('path');
var mediaPath ='';

fs.readFile(path.join(__dirname,'../config/path.config.js'),function(err,file){
    if(err&&err.code==='ENOENT'){
        let err= {
            type:'system',
            error:'path.config.js 文件不存在'
        };
        return callback(err);
    } else if (err) {
        err.type = 'system';
        return callback(err);
    }else{
        var config = JSON.parse(file);
        mediaPath = config.rootDir+config.mediaPath;
        console.log(mediaPath);
    }
});

module.exports = mediaPath;