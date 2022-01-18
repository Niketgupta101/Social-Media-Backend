const express = require("express");
const {
  fetchFollowers,
  fetchReceivedFollowRequests,
  removeFollower,
  approveFollowRequest,
  rejectFollowRequest
} = require("../../controllers/follower.controller");
const { protect } = require("../../middlewares/auth");

const router = express.Router();

// To get all the friends of the user with a given userId.
router.get(`/:userId`, protect, fetchFollowers);

// To get all Friend requests of the user with a given userId.
router.get(`/receivedRequests/:userId`, protect, fetchReceivedFollowRequests);

// To remove friend with the given userId.
router.put(`/removeFollower/:userId`, protect, removeFollower);

// To approve friend requests of the given userId.
router.put(`/approveRequest/:userId`, protect, approveFollowRequest);

// To approve friend requests of the given userId.
router.put(`/rejectRequest/:userId`, protect, rejectFollowRequest);

module.exports = router;
