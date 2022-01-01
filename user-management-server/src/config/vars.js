const path = require('path');

require('dotenv-safe').config({
    path: path.join(__dirname, '../../.env'),
    example: path.join(__dirname, '../../.env.example'),
});

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
    mongouri: process.env.MONGO_URI,
    Email_Service: process.env.EMAIL_SERVICE,
    Email_Uername: process.env.EMAIL_USERNAME,
    Email_Password: process.env.EMAIL_PASSWORD,
    Email_From: process.env.EMAIL_FROM
};