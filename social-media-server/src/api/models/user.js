const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpirationInterval } = require('../../config/vars');
const Friends = require('./friend');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username : { type: String, required: [true, "Please provide a username"], unique: true },
    Name : String,
    password : { type: String, required: [true, "Please provide a username"], minlength: 6, select: false },
    emailId : { type: String, required: [true, "Please provide a email"], unique: true },

    avatar: { type: String },
    cloudinary_id: String,
    
    location: String,
    college_city: String,
    college_name: String,

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    emailVerified : { type: Boolean, default: false},
    emailVerifyToken: String,

    website: String,
    Bio: String,

    blockedUsers: { type: [ { user: { type: Schema.ObjectId, ref: 'User' } } ], default: [] },

    Settings : {
        PrivateAccount : { type: Boolean, default : false },
        Notifications : { type : Boolean, default : true }
    },
    createdAt : { type: Date, default: new Date() },
    updatedAt : { type: Date, default: new Date() }
});

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.setUp = async function() {
    try {
        await Friends.create({ user: this._id });
    } catch (error) {
        throw error
    }
}

userSchema.methods.matchPasswords = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.transform = async function() {
    return this;
}

userSchema.methods.getSignedToken = function() {
    return jwt.sign({ id: this._id }, jwtSecret, { expiresIn: jwtExpirationInterval })
}

userSchema.methods.getAccessibleData = function() {
    const accessibleData = {};
    const fields = ['_id', 'Name', 'emailId', 'ProfilePhoto', 'createdAt'];

    fields.forEach((field) => {
        accessibleData[field] = this[field];
    });

    return accessibleData;
}

module.exports = mongoose.model("User", userSchema);