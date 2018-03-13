var mongoose = require('mongoose');

/**
 * 资讯
 */

var blogSchema= new mongoose.Schema({

    //标题
    title:{
        type:String,
        required:true
    },

    content:{
        type:String,
        required:true
    },

    date: {
        tpye: String,
        required: true
    },

    img:{
        type:String
    }
});

module.exports = mongoose.model('Blogs',blogSchema);