const cloudinary = require('cloudinary').v2;
const { cloud_name, api_key, api_secret } =  require('../../config/vars');

cloudinary.config({
    cloud_name,
    api_key,
    api_secret
})

module.exports = cloudinary;