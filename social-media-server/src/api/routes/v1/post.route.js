const express = require("express");
const {
  fetchAllPosts,
  createPost,
  fetchPost,
  editPost,
  deletePost,
  likePost,
  sharePost,
  getFeed
} = require("../../controllers/post.controller");
const { protect } = require("../../middlewares/auth");
const upload = require('../../utils/multer');

const router = express.Router();

// a. Get all posts of a user with userId ( pagination )
router.get( `/:userId/:pageNo/:pageLimit`, protect, fetchAllPosts );

// b. Create a Post.
router.post( `/`, protect, upload.single('image'), createPost );

// c. Get a post with postId.
router.post( `/:postId`, protect, fetchPost );

// d. Edit a post with postId.
router.put( `/:postId`, protect, upload.single('image'), editPost);

// e. Delete a post with postId.
router.delete( `/:postId`, protect, deletePost );

// f. [Un]Like a post with a postId.
router.put( `/like/:postId`, protect, likePost );

// g. Share a post with postId.
router.post( `/share/:postId`, protect, sharePost );

// h. Get a feed page. (pagination)
router.get( `/:pageNo/:pageLimit`, getFeed );

module.exports = router;
