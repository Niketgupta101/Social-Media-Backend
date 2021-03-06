const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendSchema = new mongoose.Schema({
    fromUser: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    toUser: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    progress: {
        type: String,
        default: 'requested'
    }
});

module.exports = mongoose.model("Friends", friendSchema);