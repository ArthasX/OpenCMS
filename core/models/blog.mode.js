var mongoose = require('mongoose');
var config = require("../../config/database.config")
/**
 * 资讯
 */

var blogSchema = new mongoose.Schema({

    status: {
        type: String,
        default: 'draft',
        enum: ['draft', 'pushed']
    },

    deleted: {
        type: Boolean,
        default: false
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
        required: true
    },
    //标题
    title: {
        type: String,
        required: true
    },
    //别名
    alias: {
        type: String,
        unique: true,
        required: true
    },
    //发布人
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },

    content: {
        type: String,
        required: true
    },

    reading: {
        //总阅读量
        total: {
            type: Number,
            default: 0,
            required: true
        },
        //日阅读量
        day: {
            type: Number,
            default: 0,
            required: true
        },
        //周阅读量
        week: {
            type: Number,
            default: 0,
            required: true
        },
        //月阅读量
        month: {
            type: Number,
            default: 0,
            required: true
        },
        //
        createAt: {
            day: {
                type: Date,
                default: Date.now,
                required: true
            },
            week: {
                type: Date,
                default: Date.now,
                required: true
            },
            month: {
                type: Date,
                default: Date.now,
                required: true
            }
        }
    },

    //缩略图
    thumbnail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
    },
    //媒体
    media: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media'
        }
    ],

    //摘要
    abstract: String,

    //内容
    content: String,

    //标签
    tags: [String],

    // 扩展
    extensions: mongoose.Schema.Types.Mixed
}, {
    collection: 'contents',
    id: false

});
module.exports = mongoose.model('Blogs', blogSchema);