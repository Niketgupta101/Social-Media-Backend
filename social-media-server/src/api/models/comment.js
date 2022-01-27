const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
  postId: {
    type: Schema.ObjectId,
    ref: `Post`,
  },
  commentedBy: {
    type: Schema.ObjectId,
    ref: `User`,
  },
  description: {
    type: String,
    text: true,
    index: true,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  replyCount: {
    type: Number,
    default: 0,
  },
  commentedAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Comment", commentSchema);
