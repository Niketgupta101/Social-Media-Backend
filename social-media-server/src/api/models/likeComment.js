const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeCommentSchema = new mongoose.Schema({
  commentId: {
    type: Schema.ObjectId,
    ref: "Comment",
  },
  userId: {
    type: Schema.ObjectId,
    ref: "User",
  },
  likedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("LikeComment", likeCommentSchema);