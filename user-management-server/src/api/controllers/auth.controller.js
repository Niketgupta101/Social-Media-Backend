const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');

exports.register = async (req, res, next) => {
    const  { username, emailId , password } = req.body;

    try {
        const user = await User.create({ username, emailId, password });

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
    res.send("forgotPassword route");

}

exports.resetPassword = async (req, res, next) => {
    res.send("forgotPassword route");

}

// -----------------------------------------------------------------------------------------

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({ success: true, token});
}