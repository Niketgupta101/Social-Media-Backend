const express = require("express");
const {
  fetchComment,
  fetchAllComments,
  createComment,
  editComment,
  deleteComment,
  likeComment,
  createReply,
  fetchAllReply,
  editReply,
  deleteReply
} = require("../../controllers/comment.controller");
const { protect } = require("../../middlewares/auth");

const router = express.Router();

// a. Get comment by commentId.
router.get( `/:commentId`, fetchComment );

// b. Get all comments for a post with postId. ( pagination )
router.get(`/postComments/:postId/:pageNo/:pageLimit`, fetchAllComments);

// c. Create a comment for a post with postId.
router.post( `/:postId`, protect, createComment );

// d. Edit a comment with commentId.
router.put( `/:commentId`, protect, editComment );

// e. Delete a comment with commentId.
router.delete( `/:commentId`, protect, deleteComment );

// f. To [Un]like a comment with commentId.
router.put( `/like/:commentId`, protect, likeComment );

// g. Reply to a comment with commentId.
router.post( `/reply/:commentId`, protect, createReply );

// h. Get all replies for a comment with commentId. (pagination)
router.get( `/allReply/:commentId/:pageNo/:pageLimit`, fetchAllReply );

// i. Edit a reply with replyId.
router.put( `/reply/:replyId`, protect, editReply );

// j. Delete a reply with replyId.
router.delete( `/reply/:replyId`, protect, deleteReply );

module.exports = router;
