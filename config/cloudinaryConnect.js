`use strict`

const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

//cấu hình cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
})

//Tạo 1 instance của cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg','png'],
    params: {
        folder: 'blog-api',
        transform: [{width: 500, height: 500, crop: 'limit'}]
    }
})

module.exports = storage