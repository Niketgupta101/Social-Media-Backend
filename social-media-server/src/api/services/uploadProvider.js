const cloudinary = require('../utils/cloudinary');

exports.uploadPhoto = async (path) => {
    try {
        const { secure_url, public_id } = await cloudinary.uploader.upload(path);

        return { secure_url, public_id };
    } catch (error) {
        throw error;
    }
}

exports.changePhoto = async (cloudinary_id, path) => {
    try {
        await cloudinary.uploader.destroy(cloudinary_id);

        const { secure_url, public_id } = await cloudinary.uploader.upload(path);

        return { secure_url, public_id };
    } catch (error) {
        throw error;
    }
}

exports.deletePhoto = async (cloudinary_id) => {
    try {
        await cloudinary.uploader.destroy(cloudinary_id);

        return { success: true, message: "Photo deleted successfully" };
    } catch (error) {
        throw error;
    }
}