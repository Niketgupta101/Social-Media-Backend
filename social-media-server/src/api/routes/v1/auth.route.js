const express = require("express");
const { register, login, forgotPassword, resetPassword, verifyEmail } = require('../../controllers/auth.controller');
const upload = require('../../utils/multer');

const router = express.Router();

router.post('/login', login);                 

router.post('/register',upload.single('image'), register);                

router.post('/forgotPassword', forgotPassword);

router.put('/resetPassword/:resetToken', resetPassword);

module.exports = router;