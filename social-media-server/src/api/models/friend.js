const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendSchema = new mongoose.Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    friends: {
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
    pendingRequests: {
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
    sentRequests:{
        type: [
            {
                user: {
                type: Schema.ObjectId,
                ref: 'User'
                }
            }
        ],
        default: []
    }
});

module.exports = mongoose.model("Friends", friendSchema);