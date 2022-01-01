const express = require('express');
const { getPrivateData } = require('../../controllers/private.controller');
const { protect } = require('../../middlewares/auth'); 
const router = express.Router();

router.get('/', protect, getPrivateData);

module.exports = router;