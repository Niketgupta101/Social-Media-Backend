const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const axios = require('axios');
const {v4 : uuidv4} = require('uuid');

exports.register = async (req, res, next) => {
    const  { username, emailId , password } = req.body;

    try {

        const emailVerifyToken = uuidv4();

        const user = await User.create({ username, emailId, password, emailVerifyToken });

        const emailVerifyUrl = `http://localhost:5000/v1/users/verifyEmail/${emailVerifyToken}`;

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password</p>
            <a href=${emailVerifyUrl} clicktracking=off>here</a>`

        await sendMail({ to: emailId, subject:'Verify Email Id', html: message});

        sendToken(user, 201, res);

    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    const { emailId, password } = req.body;

    if(!emailId || !password)
    return next(new ErrorResponse("Please provide an email an password", 400))

    try {
        const user = await User.findOne({ emailId }).select("+password");

        if(!user) return next(new ErrorResponse("Invalid Credentials", 401));


        const check = await user.matchPasswords(password);

        if(!check) return next(new ErrorResponse("Invalid Credentials", 404));

        sendToken(user, 200, res);

    } catch (error) {
        next(error);
    }
}

exports.forgotPassword = async (req, res, next) => {
    const { emailId } = req.body;

    try {
        const user = await User.findOne({emailId});

        if(!user){
            return next(new ErrorResponse("Email could not be sent", 404));
        }

        const resetToken = uuidv4();

        user.resetPasswordToken = resetToken;

        user.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

        await user.save();

        const resetUrl = `http://localhost:3000/passwordReset/${resetToken}`;

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password</p>
            <a href=${resetUrl} clicktracking=off>here</a>
        `
        try {
            await sendMail({ to: user.emailId, subject: 'Reset Password', html: message });

            res.status(200).json({ success: true, data: "Email Sent"})
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return next(new ErrorResponse("Email could not be sent", 500));
        }
    } catch (error) {
        next(error);
    }
}

exports.resetPassword = async (req, res, next) => {
    const resetPasswordToken = req.params.resetToken;

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now()}
        })

        if(!user) return next(new ErrorResponse("Invalid Reset Token", 400));

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({ success: true, data: "Password Reset Success" });
    } catch (error) {
        next(error);
    }
}

// -----------------------------------------------------------------------------------------

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({ success: true, token});
}

const sendMail = async (emailInfo) => {
    await axios.post('http://localhost:8000/sendEmail', emailInfo);
}