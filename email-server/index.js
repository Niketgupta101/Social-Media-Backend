const express = require('express');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

const app = express();
dotenv.config();

const cors = require('cors');
app.use(cors());

app.use(express.json());

var transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls:{
        rejectUnauthorized: false,
    } 
})

app.post('/sendEmail', (req,res) => {
    const { to, subject, html } = req.body;

    var mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: to,
            subject: subject,
            html: html
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if(error)
        res.send(error);
        else{
            console.log("email sent");
        res.send('verified');}
    })
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})