const ErrorResponse = require('../utils/errorResponse');
const { registerUser, loginUser, forgotPassword, resetPassword } = require('../services/authProvider');
const emailValidator = require('email-validator');

exports.register = async (req, res, next) => {
    const  user = req.body;

    if(!emailValidator.validate(user.emailId))
    return next(new ErrorResponse("Invalid Email-Id", 400));

    try {
        const { newUser, token } = await registerUser(user);

        res.status(201).json({ success: true, newUser, token});
    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    const { emailIdOrUsername, password } = req.body;

    if(!emailIdOrUsername || !password)
    return next(new ErrorResponse("Please provide an emailId/username an password", 400))

    try {
        const { user, token } = await loginUser(emailIdOrUsername, password, next);

        res.status(200).json({ success: true, user, token});

    } catch (error) {
        next(error);
    }
}

exports.forgotPassword = async (req, res, next) => {
    const { emailId } = req.body;

    try {
        const response = await forgotPassword(emailId, next);

        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
}

exports.resetPassword = async (req, res, next) => {
    const resetPasswordToken = req.params.resetToken;
    const password = req.body.password;

    try {
        const response = await resetPassword(resetPasswordToken, password);

        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
}