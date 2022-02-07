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

exports.sendPostCommentMail = async (emailId, commentedBy, commentId, postId) => {
    try {
        const postUrl = `${clientUrl}/post/${postId}`
        const commentUrl = `${clientUrl}/post/comment/${commentId}`
        const subject = 'Post Comment Notification.'

        const message = `<h1>${commentedBy} has commented to your <a href=${postUrl}>post</a></h1>
                <a href=${commentUrl}>View Comment</a>`;

        await axios.post(`${baseUrl}/sendEmail`, { to: emailId, subject, html: message });
    } catch (error) {
        throw error;
    }
}

exports.sendCommentReplyMail = async (emailId, repliedBy, replyId, commentId) => {
    try {
        const replyUrl = `${clientUrl}/post/comment/reply/${replyId}`
        const commentUrl = `${clientUrl}/post/comment/${commentId}`
        const subject = 'Comment Reply Notification.'

        const message = `<h1>${repliedBy} has replied to your <a href=${commentUrl}>comment</a></h1>
                <a href=${replyUrl}>View Reply</a>`;

        await axios.post(`${baseUrl}/sendEmail`, { to: emailId, subject, html: message });
    } catch (error) {
        throw error;
    }
}

exports.sendMailForTaggedUser = async (emailId, postId, taggedBy) => {
    try {
        const postUrl = `${clientUrl}/post/${postId}`
        const subject = 'Social media activity Notification.'

        const message = `<h1>${taggedBy} has tagged to you his/her post</h1>
                <a href=${postUrl}>View Comment</a>`;

        await axios.post(`${baseUrl}/sendEmail`, { to: emailId, subject, html: message });
    } catch (error) {
        throw error;
    }
}

exports.sendMailForApproveFriendRequest = async (emailId, loggedUserName) => {
    try {
        const requestsUrl = `${clientUrl}/user/friendRequests`
        const subject = 'Social media activity Notification.'

        const message = `<h1>${loggedUserName} has accepted tour friend request.</h1>
                <a href=${requestsUrl}>View Friend Requests</a>`;

        await axios.post(`${baseUrl}/sendEmail`, { to: emailId, subject, html: message });
    } catch (error) {
        throw error;
    }
}

exports.sendMailForSentFriendRequest = async (emailId, loggedUserName) => {
    try {
        const requestsUrl = `${clientUrl}/friendRequests`
        const subject = 'Social media activity Notification.'

        const message = `<h1>${loggedUserName} has sent you a friend request</h1>
                <a href=${requestsUrl}>View Friend Requests</a>`;

        await axios.post(`${baseUrl}/sendEmail`, { to: emailId, subject, html: message });
    } catch (error) {
        throw error;
    }
}

