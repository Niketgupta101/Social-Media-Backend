const User = require('../models/user');
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../config/vars')
const ErrorResponse = require('../utils/errorResponse');
const mongoose = require('mongoose');
const { deletePhoto, changePhoto } = require('./uploadProvider');

exports.verifyEmailService = async (emailVerifyToken, next) => {
    try {
        const user = await User.findOne({ emailVerifyToken });

        if(!user) return next(new ErrorResponse("Invalid verification Link", 400));

        user.emailVerified = true;
        user.emailVerifyToken = undefined;
        user.setUp();
        await user.save();

        return { success: true, data: "Email Verified Successfully" };
    } catch (error) {
        throw error;
    }
}

exports.updateAvatar = async (id, path, next) => {
    try {
        const user = await User.findById(id);

        if(!user) next(new ErrorResponse("User doesn't exist", 400));

        let { secure_url, public_id } = await changePhoto(user.cloudinary_id, path);

        user.cloudinary_id = public_id;
        user.avatar = secure_url;
        await user.save();

        return { success: true, data: user };
    } catch (error) {
        throw error;
    }
}

exports.blockUserWithId = async (id, userId, next) => {
    try {
        const loggeduser = await User.findOne({ _id: userId });

        const user = await User.findOne({ _id: id });
        if(!user) return next(new ErrorResponse("No user with given Id exists.", 404));

        const index = loggeduser.blockedUsers.findIndex(i => i.user.valueOf() === id );
        if(index!== -1) return next(new ErrorResponse("Already Blocked.", 400));

        loggeduser.blockedUsers.push({ user: id });
        await loggeduser.save();

        return { success: true, message: "Blocked successfully.", user: loggeduser };
    } catch (error) {
        throw error;
    }
}

exports.unblockUserWithId = async (id, next) => {
    try {
        const user = await User.findOne({ _id: id });
        if(!user) return next(new ErrorResponse("No user with given Id exists.", 404));

        const index = user.blockedUsers.findIndex(i => i.user.valueOf() === id );
        if(index === -1) return next(new ErrorResponse("User not Blocked.", 400));

        user.blockedUsers = user.blockedUsers.filter(i => i.user.valueOf()!==id);
        await user.save();

        return { success: true, message: "Unblocked successfully.", user };
    } catch (error) {
        throw error;
    }
}

exports.fetchAllUsers = async (pagelimit, pageno) => {
    try {
        var users = await User.find().skip(Math.max(0,pageno-1)*pagelimit).limit(pagelimit);
        users.map((user) => user.getAccessibleData());

        return users;
    } catch (error) {
        throw error;
    }
}

exports.fetchUserWithId = async(userId, _id) => {
    try {
        const user = await User.findOne({ _id: userId });

        if(!user) return next(new ErrorResponse("No user found with the given id", 404));

        const decoded = jwt.verify( _id, jwtSecret);

        // does the user calling api and the id provided match or not.
        if(userId !== decoded.id)
        {
            const accessibleData = user.getAccessibleData();
            return accessibleData;
        } else {
            return user;
        }
    } catch (error) {
        throw error;
    }
}

exports.editUserWithId = async (updatedDetails, _id) => {
    try {
        // Check if there exist's a User with given userId.
        if(!mongoose.Types.ObjectId.isValid(_id)) return next(new ErrorResponse("No user found with the given id", 404));

        // Update the user details.
        const updatedUser = await User.findByIdAndUpdate(_id, updatedDetails, { new: true });

        return updatedUser;
    } catch (error) {
        throw error;
    }
}

exports.fetchUsersWithInfo = async (info, pagelimit, pageno, next) => {
    try {
        let users = await User.find(
            { $text: { $search: `${info}` } }
         ).sort( { score: { $meta: "textScore" } } ).skip(Math.max(0,pageno-1)*pagelimit).limit(pagelimit);

        if(!users) return next(new ErrorResponse("No user with given info found", 404));

        users.map((user) => user.getAccessibleData());

        return users;
    } catch (error) {
        throw error;
    }
}

exports.removeUserWithId = async (id) => {
    try {
        let user = await User.findById(id);

        await deletePhoto(user.cloudinary_id);

        await user.remove();

        return { success: true, message: "User removed."};
    } catch (error) {
        throw error;
    }
}