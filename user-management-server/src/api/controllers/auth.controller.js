const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');

exports.register = async (req, res, next) => {
    const  { username, emailId , password } = req.body;

    try {
        const user = await User.create({ username, emailId, password });

        res.status(201).send({ success: true, user });

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

        res.status(201).send({ success: true, token: "bhecweigvi" });

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