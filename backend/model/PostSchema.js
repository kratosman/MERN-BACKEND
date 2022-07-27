const mongoose = require('mongoose')

const PostRouter = new mongoose.Schema({
    name:{ type: String, ref:'User'},
    post: {type:String, required: true},
    image: { type:String},
    user_id: mongoose.Schema.ObjectId
}, { timestamps: true})

module.exports = mongoose.model('Post', PostRouter)