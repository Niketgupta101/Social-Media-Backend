const axios = require('axios');
const { baseUrl, clientUrl, serverUrl } = require('../../config/vars'); 

exports.sendConfirmationMail = async (emailId, emailVerifyToken) => {
    try {
        const emailVerifyUrl = `${serverUrl}/v1/users/verifyEmail/${emailVerifyToken}`;

        const subject = 'Mail to verify email id.'

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password</p>
            <a href=${emailVerifyUrl} clicktracking=off>here</a>`

        await axios.post(`${baseUrl}/sendEmail`, { to: emailId, subject , html: message});

    } catch (error) {
        throw error;
    }
}

exports.sendResetPasswordMail = async (emailId, resetToken) => {
    try {
        const resetUrl = `${clientUrl}/passwordReset/${resetToken}`;

        const subject = 'Mail to reset your Password'

        const message = `<h1>You have requested a password reset</h1>
                <p>Please go to this link to reset your password</p>
                <a href=${resetUrl} clicktracking=off>here</a>`

        await axios.post(`${baseUrl}/sendEmail`, { to: emailId, subject , html: message});

    } catch (error) {
        throw error;   
    }
}