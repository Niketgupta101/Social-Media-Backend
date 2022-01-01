const express = require("express");
const { verifyEmail, fetchUser, editUser, searchUsers } = require("../../controllers/user.controller");
const { protect } = require('../../middlewares/auth');

const router = express.Router();


router.get('/verifyEmail/:verifyToken', verifyEmail);

router.get('/:id',protect, fetchUser);

router.put('/:id',protect, editUser);

router.get('/',protect, searchUsers);


module.exports = router;