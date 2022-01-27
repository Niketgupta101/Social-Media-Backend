const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
  postedBy: {  type: Schema.ObjectId,  ref: `User` },

  isShared: {  type: Boolean,  default: false },
  sharedPost: {  type: Schema.ObjectId,  ref: `Post` },

  caption: {  type: String,  text: true,  index: true },

  Image: {  type: String },
  cloudinary_id: String, 

  description: {  type: String,  text: true,  index: true },

  taggedUsers: [{ userId: {  type: String,  ref: `User`} }],

  likeCount: {  type: Number,  default: 0 },

  isCommentBlocked: {  type: Boolean,  default: false },
  commentCount: {  type: Number,  default: 0 },

  createdAt: {  type: Date,  default: Date.now() },
  updatedAt: {  type: Date,  default: Date.now() },
});

module.exports = mongoose.model("Post", postSchema);
