const express = require('express');
const userRoutes = require('./user.route.js');
const authRoutes = require('./auth.route.js');
const privateRoute = require('./private.js');
const { route } = require('./private.js');

const router = express.Router();

router.get('/ping', (req, res) => res.send('OK'));

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/private', privateRoute);

module.exports = router;