const User = require('../models/userModel');

exports.register = async (req, res, next) => {
    const  { username, emailId , password } = req.body;

    try {
        const user = await User.create({ username, emailId, password });

        res.status(201).send({ success: true, user });

    } catch (error) {
        res.status(500).send({ success: false, error: error.message })
    }
}

exports.login = async (req, res, next) => {
    const { emailId, password } = req.body;

    if(!emailId || !password)
    res.status(400).send({success: false, error: "Please provide email and password"})

    try {
        const user = await User.findOne({ emailId }).select("+password");

        if(!user) res.status(404).send({ success: false, error: " Invalid Credentials"});

        const check = await user.matchPasswords(password);

        if(!check) res.status(404).send({success: false, error: "Invalid Credentials"});

        res.status(201).send({ success: true, token: "bhecweigvi" });

    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
}

exports.forgotPassword = async (req, res, next) => {
    res.send("forgotPassword route");

}

exports.resetPassword = async (req, res, next) => {
    res.send("forgotPassword route");

}