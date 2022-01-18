const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followerSchema = new mongoose.Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    followers: {
        type: [
            {
                user: {
                type: Schema.ObjectId,
                ref: 'User'
                }
            }
        ],
        default: []
    },
    receivedRequests: {
        type: [
            {
                user: {
                type: Schema.ObjectId,
                ref: 'User'
                }
            }
        ],
        default: []
    },
});

module.exports = mongoose.model("Follower", followerSchema);