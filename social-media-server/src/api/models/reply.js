const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const replySchema = new mongoose.Schema({
  commentId: {
    type: Schema.ObjectId,
    ref: `Comment`,
  },
  repliedId: {
    type: Schema.ObjectId,
    ref: `User`,
  },
  description: {
    type: String,
    text: true,
    index: true,
  },
  repliedAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Reply", replySchema);
