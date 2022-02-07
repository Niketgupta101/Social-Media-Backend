const express = require("express");
const {
  fetchAllPosts,
  getTaggedPosts,
  createPost,
  fetchPost,
  editPost,
  deletePost,
  likePost,
  sharePost,
  getFeed,
  getPostByTag,
  getPostByMostPopularTags,
  getMostLikedPosts
} = require("../../controllers/post.controller");
const { protect } = require("../../middlewares/auth");
const upload = require('../../utils/multer');

const router = express.Router();

// a. Get all posts of a user with userId ( pagination )
router.get( `/:userId/:pageNo/:pageLimit`, protect, fetchAllPosts );

// Fetch all taggedPosts for the user.
router.get('/taggedPosts/:userId/:pageNo/:pageLimit', protect, getTaggedPosts);

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

// i Get all post with tag. (pagination)
router.get( `/tag/:tag/:pageNo/:pageLimit`, getPostByTag );

//j. get posts with most popular tags. (pagination)
router.get(`/tag/mostPopular/:pageNo/:pageLimit`, getPostByMostPopularTags);

//k. get most liked posts.
router.get('/mostLiked/:pageNo/:pageLimit', getMostLikedPosts);

module.exports = router;
