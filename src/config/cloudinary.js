const cloudinary = require('cloudinary').v2;
var fs = require('fs');
require("dotenv").config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

exports.uploads = async (file, folder) => {
    return await cloudinary.uploader.upload(file, {
        resource_type: "image",
        folder: folder
    }).then((result) => {
        return {code: 1, ...result}
    }).catch((err)=> {
        return {code: 0, ...err}
    })
}

exports.url = (file, option) => {
    var image = cloudinary.url(file, option)
    return image;
}

exports.remove = async (filename) => {
    cloudinary.uploader.destroy(filename, function(error,result) {
    });
}