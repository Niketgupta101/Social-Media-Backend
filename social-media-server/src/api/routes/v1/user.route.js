const express = require("express");
const { verifyEmail, fetchUser, editUser, searchUsers, getAllUsers, removeUser, changeAvatar, blockUser, unblockUser } = require("../../controllers/user.controller");
const { protect } = require('../../middlewares/auth');

const router = express.Router();

// To verify Email-Id Id.
router.get('/verifyEmail/:verifyToken', verifyEmail);

// To change profile photo.
router.put('/avatar/:id', changeAvatar);

// To block a user.
router.put('/block/:userId', protect, blockUser);

// To unblock a user.
router.put('/unblock/:userId', protect, unblockUser);

// To fetch user with given id(as param) with restrictions.
router.get('/fetchUser/:id', protect, fetchUser);

// To edit personal details of the user with given id.
router.put('/editUser/:id', protect, editUser);

// To fetch all the users with restriction( only username, id, Name)
router.get('/fetchAllUsers', protect, getAllUsers);

// to fetch user with given info like name loaction etc.
router.get('/searchUsersWithInfo/:info', protect, searchUsers);

// to remove user.
router.delete('/:id', protect, removeUser)


module.exports = router;
