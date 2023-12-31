const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    title: String,
    msg: String,
    likes: Number,
    dislikes: Number,
    user:String
},{
    versionKey : false
})

const PostModel = mongoose.model('/post',PostSchema);

module.exports = {
    PostModel
}