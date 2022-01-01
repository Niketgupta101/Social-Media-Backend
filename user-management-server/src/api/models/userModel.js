const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { jwtSecret, jwtExpirationInterval } = require('../../config/vars');

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: [true, "Please provide a username"],
    },
    password : {
        type: String,
        required: [true, "Please provide a username"],
        minlength: 6,
        select: false
    },
    emailId : {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerified : {
        type: Boolean,
        default: false
    },
    emailVerifyToken: String,
    createdAt : {
        type: Date,
        default: new Date()
    },
    updatedAt : {
        type: Date,
        default: new Date()
    }
});

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.matchPasswords = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.getSignedToken = function() {
    return jwt.sign({ id: this._id }, jwtSecret, { expiresIn: jwtExpirationInterval })
}

module.exports = mongoose.model("User", userSchema);