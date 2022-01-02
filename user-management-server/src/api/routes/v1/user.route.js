const express = require("express");
const { verifyEmail, fetchUser, editUser, searchUsers, getAllUsers } = require("../../controllers/user.controller");
const { protect } = require('../../middlewares/auth');

const router = express.Router();

// To verify Email-Id Id.
router.get('/verifyEmail/:verifyToken', verifyEmail);

// To fetch user with given id(as param) with restrictions.
router.get('/fetchUser/:id', protect, fetchUser);

// To edit personal details of the user with given id.
router.put('/editUser/:id', protect, editUser);

// To fetch all the users with restriction( only username, id, Name)
router.get('/fetchAllUsers', protect, getAllUsers);

// to fetch user with given info like name loaction etc.
router.get('/searchUsersWithInfo/:info', protect, searchUsers);


module.exports = router;
