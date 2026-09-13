const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Configure Cloudinary using your environmental variables
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// 2. Define the storage engine settings for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV', // This is the folder name inside your Cloudinary dashboard
        allowedFormats: ["png", "jpg", "jpeg"]
    },
});

// 3. Export both the instance and the storage engine
module.exports = {
    cloudinary,
    storage
};