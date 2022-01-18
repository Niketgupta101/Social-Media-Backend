const express = require("express");
const {
  fetchFriends,
  fetchFriendRequests,
  sendFriendRequest,
  approveFriendRequest,
  rejectFriendRequest,
  removeFriend,
  friendSuggestions,
} = require("../../controllers/friend.controller");
const { protect } = require("../../middlewares/auth");

const router = express.Router();

// To get all the friends of the user with a given userId.
router.get(`/Friends/:userId/:pageno/:pagelimit`, protect, fetchFriends);

// To get all Friend requests of the user with a given userId.
router.get(`/FriendRequests/:userId/:pageno/:pagelimit`, protect, fetchFriendRequests);

// To send friend requests with a given userId.
router.put(`/FriendRequest/:userId`, protect, sendFriendRequest);

// To approve friend requests of the given userId.
router.put(`/approveFriendRequest/:userId`, protect, approveFriendRequest);

// To reject friend requests of the given userId.
router.put(`/rejectFriendRequest/:userId`, protect, rejectFriendRequest);

// To remove friend with the given userId.
router.put(`/removeFriend/:userId`, protect, removeFriend);

// To get friends' suggestions for the user.
router.get(`/friendSuggestions/:userId`, protect, friendSuggestions);

module.exports = router;
