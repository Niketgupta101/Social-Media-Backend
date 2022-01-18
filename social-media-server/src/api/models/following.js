const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followingSchema = new mongoose.Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    following: {
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
    sentRequests: {
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

module.exports = mongoose.model("Following", followingSchema);