const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likePostSchema = new mongoose.Schema({
  postId: {
    type: Schema.ObjectId,
    ref: "Post",
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

module.exports = mongoose.model("LikePost", likePostSchema);
