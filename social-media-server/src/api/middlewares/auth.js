const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorResponse = require('../utils/errorResponse');
const { jwtSecret } = require('../../config/vars');

exports.protect = async (req, res, next) => {
    let token;

    if(req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1]
    }
    if(!token) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);

        const user = await User.findById(decoded.id);

        if(!user){
            return next(new ErrorResponse("No user found with this id", 404));
        }
        if(!user.emailVerified){
            return next(new ErrorResponse("Please Verify your email before proceeding further."));
        }

        req.user = user;

        next();
    } catch (error) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }
}