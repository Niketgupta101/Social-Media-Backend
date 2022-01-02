const express = require("express");
const { verifyEmail, fetchUser, editUser, searchUsers, getAllUsers } = require("../../controllers/user.controller");
const { protect } = require('../../middlewares/auth');

const router = express.Router();


router.get('/verifyEmail/:verifyToken', verifyEmail);

router.get('/fetchUser/:id', protect, fetchUser);

router.put('/editUser/:id', protect, editUser);

router.get('/fetchAllUsers', protect, getAllUsers);

router.get('/searchUsersWithInfo/:info', protect, searchUsers);


module.exports = router;