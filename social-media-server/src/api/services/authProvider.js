const {v4 : uuidv4} = require('uuid');
const User = require('../models/user');
const ErrorResponse = require('../utils/errorResponse');
const { sendConfirmationMail, sendResetPasswordMail } = require('./emailProvider');
const cloudinary = require('../utils/cloudinary');
const { uploadPhoto } = require('./uploadProvider');

exports.registerUser = async (user, path) => {
    try {
        user.emailVerifyToken = uuidv4();
        const { secure_url, public_id } = await uploadPhoto(path);

        const data = {
            ...user,
            avatar: secure_url,
            cloudinary_id: public_id
        };

        const newUser = await User.create(data);

        await sendConfirmationMail(newUser.emailId, newUser.emailVerifyToken);

        const token = newUser.getSignedToken();

        return { newUser, token };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.loginUser = async ( emailIdOrUsername, password, next ) => {
    try {
        const user = await User.findOne({ $or: [ { username: emailIdOrUsername }, { emailId: emailIdOrUsername } ] }).select("+password");
        
        if(!user) return next(new ErrorResponse("Invalid Credentials", 401));

        const check = await user.matchPasswords(password);

        if(!check) return next(new ErrorResponse("Invalid Credentials", 404));

        const token = user.getSignedToken();

        return { user, token };
    } catch (error) {
        throw error;
    }
}

exports.forgotPassword = async (emailId, next) => {
        try {
            const user = await User.findOne({emailId});

            if(!user){
                return next(new ErrorResponse("Email could not be sent", 404));
            }

            const resetToken = uuidv4();

            user.resetPasswordToken = resetToken;
            user.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

            await user.save();
        
            try {
                await sendResetPasswordMail(user.emailId, resetToken);

                return { success: true, message: "Email Sent"};
            } catch (error) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpire = undefined;

                await user.save();

                return next(new ErrorResponse("Email could not be sent", 500));
            }
        } catch (error) {
            throw error;
        }
}

exports.resetPassword = async (resetPasswordToken, password) => {
    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now()}
        })

        if(!user) return next(new ErrorResponse("Invalid Reset Token", 400));

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return { success: true, data: "Password Reset Success" }
    } catch (error) {
        throw error;
    }
}