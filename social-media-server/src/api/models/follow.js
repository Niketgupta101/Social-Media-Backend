const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followSchema = new mongoose.Schema({
    follower: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    following: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    progress: {
        type: String,
        default: 'requested'
    }
});

module.exports = mongoose.model("Follow", followSchema);