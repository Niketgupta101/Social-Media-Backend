const express = require('express');
const userRoutes = require('./user.route.js');
const authRoutes = require('./auth.route.js');
const friendRoutes = require('./friend.route.js');
const followerRoutes = require('./friend.route.js');
const followingRoutes = require('./friend.route.js');

const router = express.Router();

router.get('/ping', (req, res) => res.send('OK'));

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/friends', friendRoutes);
router.use('/follower', followerRoutes);
router.use('/following', followingRoutes);

module.exports = router;