const express = require("express");
const {
  fetchFollowing,
  fetchSentFollowRequests,
  unfollowUser,
  sendFollowRequest,
} = require("../../controllers/following.controller");
const { protect } = require("../../middlewares/auth");

const router = express.Router();

// To get all the friends of the user with a given userId.
router.get(`/:userId`, protect, fetchFollowing);

// To get all Friend requests of the user with a given userId.
router.get(`/sentRequests/:userId`, protect, fetchSentFollowRequests);

// To remove friend with the given userId.
router.put(`/unfollow/:userId`, protect, unfollowUser);

// To approve friend requests of the given userId.
router.put(`/sendRequest/:userId`, protect, sendFollowRequest);

module.exports = router;
