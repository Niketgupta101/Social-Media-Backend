const axios = require('axios');

exports.sendConfirmationMail = async (emailId, emailVerifyToken) => {
    try {
        const emailVerifyUrl = `http://localhost:5000/v1/users/verifyEmail/${emailVerifyToken}`;

        const subject = 'Mail to verify email id.'

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password</p>
            <a href=${emailVerifyUrl} clicktracking=off>here</a>`

        await axios.post('http://localhost:8000/sendEmail', { to: emailId, subject , html: message});

    } catch (error) {
        throw error;
    }
}

exports.sendResetPasswordMail = async (emailId, resetToken) => {
    try {
        const resetUrl = `http://localhost:3000/passwordReset/${resetToken}`;

        const subject = 'Mail to reset your Password'

        const message = `<h1>You have requested a password reset</h1>
                <p>Please go to this link to reset your password</p>
                <a href=${resetUrl} clicktracking=off>here</a>`

        await axios.post('http://localhost:8000/sendEmail', { to: emailId, subject , html: message});

    } catch (error) {
        throw error;   
    }
}