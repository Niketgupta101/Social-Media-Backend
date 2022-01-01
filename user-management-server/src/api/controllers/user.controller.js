const User = require('../models/userModel');


exports.verifyEmail = async (req, res, next) => {
    const emailVerifyToken = req.params.verifyToken;

    try {
        const user = await User.findOne({ emailVerifyToken });

        if(!user) return next(new ErrorResponse("Invalid verification Link", 400));

        user.emailVerified = true;
        user.emailVerifyToken = undefined;

        await user.save();

        res.status(201).json({ success: true, data: "Email Verified Successfully" });
    } catch (error) {
        next(error);
    }
}


exports.fetchUser = async (req, res, next) => {
    try{

    } catch(err) {
        
    }
}

exports.editUser = async (req, res, next) => {
    try{

    } catch(err) {
        
    }
}

exports.searchUsers = async (req, res, next) => {
    try{

    } catch(err) {
        
    }
}